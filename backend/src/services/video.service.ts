import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video, VideoDocument } from '../model/video.schema';
import { createReadStream, statSync, unlinkSync } from 'fs';
import { join } from 'path';
import { Request, Response } from 'express';
import { UUID } from 'crypto';

@Injectable()
export class VideoService {
  private readonly logger = new Logger(VideoService.name);
  constructor(
    @InjectModel(Video.name) private videoModel: Model<VideoDocument>,
  ) {}

  async assertAndFetchValidVideo(id: string) {
    const validVideo = await this.videoModel.findOne({ _id: id });

    if (!validVideo) {
      throw new NotFoundException(null, 'VideoNotFound');
    }

    const { video } = validVideo;
    if (!video) {
      throw new NotFoundException(null, 'ContentNotFound');
    }

    return validVideo;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async createVideo(video: Object): Promise<Video> {
    const newVideo = new this.videoModel(video);
    return newVideo.save();
  }

  async readVideo(id?: string): Promise<Video | Video[] | null> {
    if (id) {
      return this.videoModel.findOne({ _id: id }).populate('createdBy');
    }

    const videos = this.videoModel
      .find()
      .limit(10)
      .populate('createdBy')
      .exec();
    return videos;
  }

  async streamVideo(
    id: UUID,
    response: Response,
    request: Request,
  ): Promise<any> {
    try {
      const data = await this.assertAndFetchValidVideo(id);
      const CHUNK_SIZE = 1 * 1e6;
      const { video } = data;
      const { range } = request.headers;
      const start = range ? Number(range.replace(/\D/g, '')) : 0;
      const videoPath = statSync(join(process.cwd(), `./public/${video}`));
      const end = Math.min(start + CHUNK_SIZE, videoPath.size - 1);
      const videoLength = end - start + 1;

      response.status(206);
      response.header({
        'Content-Range': `bytes ${start}-${end}/${videoPath.size}`,
        'Accept-Ranges': 'bytes',
        'Content-length': videoLength,
        'Content-Type': 'video/mp4',
      });

      const videoStream = createReadStream(
        join(process.cwd(), `./public/${video}`),
        { start, end },
      );
      videoStream.pipe(response);
    } catch (error: any) {
      if (error.status === HttpStatus.NOT_FOUND)
        throw new NotFoundException(id, 'VideoNotFound');
      throw new ServiceUnavailableException();
    }
  }

  async update(id: UUID, video: Video): Promise<Video> {
    return await this.videoModel.findByIdAndUpdate(id, video, { new: true });
  }

  async delete(id: UUID): Promise<any> {
    const data = await this.assertAndFetchValidVideo(id);
    try {
      unlinkSync(`./public/${data.video}`);
      unlinkSync(`./public/${data.coverImage}`);
    } catch (error) {
      this.logger.error({
        message: 'unable to delete stored files, removing entry from DB',
        error,
      });
    }

    return await this.videoModel.findByIdAndRemove(id);
  }

  async findByName(
    name: string,
    startIndex: number,
    offset: number,
  ): Promise<{
    videos: Video[] | null;
    startIndex: number;
    offset: number;
    count: number;
  }> {
    try {
      const videos = await this.videoModel
        .find({ title: { $regex: new RegExp(name) } })
        .limit(10)
        .skip(startIndex)
        .populate('createdBy')
        .exec();

      const count = await this.videoModel
        .find({
          title: { $regex: new RegExp(name) },
        })
        .count();

      return {
        videos,
        startIndex,
        offset,
        count,
      };
    } catch (e) {
      throw new HttpException('Something went wrong' + e, HttpStatus.AMBIGUOUS);
    }
  }
}
