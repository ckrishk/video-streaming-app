import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { UserDTO, VideoDTO } from './dtos/service.dto';

@Schema()
export class Video implements VideoDTO {
  @Prop()
  title: string;
  @Prop()
  video: string;
  @Prop()
  coverImage: string;
  @Prop({ default: Date.now() })
  uploadDate: Date;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: UserDTO;
}

export type VideoDocument = Video & Document;
export const VideoSchema = SchemaFactory.createForClass(Video);
