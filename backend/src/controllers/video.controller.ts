import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
  Logger,
  HttpException,
  Query,
} from '@nestjs/common';
import { Video } from '../model/video.schema';
import { VideoService } from '../services/video.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UUID } from 'crypto';
import { Response } from 'express';

@Controller('video')
export class VideoController {
  private readonly logger = new Logger(VideoController.name);
  constructor(private readonly videoService: VideoService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'cover', maxCount: 1 },
    ]),
  )
  async createBook(
    @Res() response: Response,
    @Req() request: Partial<Request> & { user: string },
    @Body() video: Video,
    @UploadedFiles()
    files: { video?: Express.Multer.File[]; cover?: Express.Multer.File[] },
  ) {
    this.logger.log('Saving new files', files.cover[0].filename);
    const requestBody = {
      createdBy: request.user,
      title: video.title,
      video: files.video[0].filename,
      coverImage: files.cover[0].filename,
    };
    const newVideo = await this.videoService.createVideo(requestBody);
    return response.status(HttpStatus.CREATED).json({
      newVideo,
    });
  }

  @Get()
  async findLatest(@Req() request) {
    if (request.id) return this.videoService.readVideo(request.id);
    return await this.videoService.readVideo();
  }

  @Get('/:id')
  async stream(@Param('id') id, @Res() response, @Req() request) {
    const res = await this.videoService.streamVideo(id, response, request);
    return res;
  }

  @Put('/:id')
  async update(
    @Param('id') id: UUID,
    @Body() video: Video,
    @Res() response: Response,
  ) {
    const updatedVideo = await this.videoService.update(id, video);
    return response.status(HttpStatus.OK).json(updatedVideo);
  }

  @Delete('/:id')
  async delete(@Res() response: Response, @Param('id') id: UUID) {
    await this.videoService.delete(id);
    return response.status(HttpStatus.OK).json({
      user: null,
    });
  }

  @Get('/default/search')
  async findByName(
    @Query('title') title?: string,
    @Query('startIndex') startIndex?: number,
    @Query('offset') offset?: number,
  ) {
    if (!startIndex || !offset) {
      startIndex = 0;
      offset = 10;
    }
    if (offset <= 0 || startIndex < 0) {
      throw new HttpException('Invalid param received', HttpStatus.BAD_REQUEST);
    }

    if (!title) {
      const latest: Video[] = (await this.videoService.readVideo()) as Video[];
      return {
        videos: latest,
        startIndex,
        offset,
        count: offset,
      };
    }

    const videoList = await this.videoService.findByName(
      title,
      startIndex,
      offset,
    );

    return videoList;
  }
}
