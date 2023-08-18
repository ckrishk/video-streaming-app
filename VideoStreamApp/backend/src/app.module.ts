import {
  Module,
  RequestMethod,
  MiddlewareConsumer,
  Logger,
  HttpException,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { JwtModule } from '@nestjs/jwt';
import { secret } from './utils/constants';
import { join } from 'path/posix';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { User, UserSchema } from './model/user.schema';
import { Video, VideoSchema } from './model/video.schema';
import { VideoController } from './controllers/video.controller';
import { UserController } from './controllers/user.controller';
import { VideoService } from './services/video.service';
import { UserService } from './services/user.service';
import { isAuthenticated } from './middleware/auth.middleware';
import { v4 as uuidv4 } from 'uuid';
import { ConfigModule } from '@nestjs/config';

Logger.log(join(__dirname, '..', 'public'));

@Module({
  imports: [
    ConfigModule.forRoot({}),
    JwtModule.register({
      secret,
      signOptions: { expiresIn: '2h' },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MongooseModule.forRoot(
      `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@localhost:27017`,
      {
        dbName: 'Stream',
      },
    ),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
    MulterModule.register({
      storage: diskStorage({
        destination: './public',
        filename: (req, file, cb) => {
          console.log('req', req);
          console.log('file', file.mimetype);
          const ext = file.mimetype.split('/')[1];
          if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'video/mp4' ||
            file.mimetype === 'video/quicktime'
          ) {
            cb(null, `${uuidv4()}-${Date.now()}.${ext}`);
          } else {
            return cb(
              new HttpException(
                'Only .png, .jpeg and mov, mp4 format allowed!',
                400,
              ),
              'Unsupported File Format received',
            );
          }
        },
      }),
    }),
  ],
  controllers: [AppController, VideoController, UserController],
  providers: [AppService, VideoService, UserService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(isAuthenticated)
      .exclude({ path: '/video/:id', method: RequestMethod.GET })
      .forRoutes(VideoController);
  }
}
