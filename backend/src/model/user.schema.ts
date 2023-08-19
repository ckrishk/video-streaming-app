import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserDTO } from './dtos/service.dto';

@Schema()
export class User implements UserDTO {
  @Prop({ required: true })
  fullname: string;
  @Prop({ required: true, unique: true, lowercase: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ default: Date.now() })
  createdDate: Date;
  @Prop({ default: Date.now() })
  updatedDate: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
