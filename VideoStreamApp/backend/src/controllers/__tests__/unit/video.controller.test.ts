import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { Response } from 'express';
import { VideoController } from '../../video.controller';
import { VideoService } from '../../../services/video.service';
import { UserDTO, VideoDTO } from '../../../model/dtos/service.dto';
import uuid4 from 'uuid4';
import { UUID } from 'crypto';
import { Video } from 'src/model/video.schema';

describe('VideoController', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let videoController: VideoController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let videoService: VideoService;
  const testUser: UserDTO = {
    fullname: 'test-user',
    email: 'test@user.com',
    password: 'password',
    createdDate: new Date(),
    updatedDate: new Date(),
  };

  const testVideo: VideoDTO = {
    title: 'test-title',
    video: 'test-video',
    coverImage: 'test-cover',
    uploadDate: new Date(),
    createdBy: testUser,
  };

  const videoList = {
    videos: [testVideo],
    startIndex: 0,
    offset: 10,
    count: 1,
  };

  const mockVideoService = {
    findByName: jest.fn().mockResolvedValue(videoList),
    delete: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      controllers: [VideoController],
      providers: [VideoService],
    })
      .overrideProvider(VideoService)
      .useValue(mockVideoService)
      .compile();

    videoService = moduleRef.get<VideoService>(VideoService);
    videoController = moduleRef.get<VideoController>(VideoController);
  });

  describe('Video Controller', () => {
    it('should be search video', async () => {
      const videoList = await videoController.findByName();
      expect(mockVideoService.findByName).toBeCalledTimes(1);
      expect(videoList).toBeDefined();
      expect(videoList.videos.length).toBe(1);
      expect(videoList.startIndex).toBe(0);
      expect(videoList.count).toBe(1);
    });

    it('should be able to delete', async () => {
      const uuid = uuid4 as unknown as UUID;
      const res = {} as unknown as Response;
      res.json = jest.fn().mockResolvedValue({ user: null });
      res.status = jest.fn(() => res);

      const deleteStatus = await videoController.delete(res, uuid);
      expect(mockVideoService.delete).toBeCalledTimes(1);
      expect(deleteStatus).toEqual({ user: null });
    });

    it('should be able to update', async () => {
      const uuid = uuid4 as unknown as UUID;
      const res = {} as unknown as Response;
      const body = {} as unknown as Video;
      res.json = jest.fn().mockResolvedValue({ video: testVideo });
      res.status = jest.fn(() => res);

      const updateStatus = await videoController.update(uuid, body, res);
      expect(mockVideoService.update).toBeCalledTimes(1);
      expect(updateStatus).toEqual({ video: testVideo });
    });
  });
});
