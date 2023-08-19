import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../model/user.schema';
import { JwtService } from '@nestjs/jwt';
import { SignInResponse, SignUpResponse } from 'src/model/dtos/service.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async signup(user: User): Promise<SignUpResponse> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, salt);
    const reqBody = {
      fullname: user.fullname,
      email: user.email,
      password: hash,
    };
    const userExists = await this.userExist(user.email);
    if (!userExists) {
      const newUser = new this.userModel(reqBody);
      const createdUser = await newUser.save();
      return {
        fullname: createdUser.fullname,
        email: createdUser.email,
      };
    }
  }

  async signin(
    user: User,
    jwt: JwtService,
  ): Promise<SignInResponse | HttpException> {
    const foundUser = await this.userModel
      .findOne({ email: user.email })
      .exec();
    if (foundUser) {
      const { password } = foundUser;
      if (await bcrypt.compare(user.password, password)) {
        const payload = { email: user.email };
        this.logger.log(`User ${user.email} logged in successfully`);
        return {
          fullname: foundUser.fullname,
          email: foundUser.email,
          token: jwt.sign(payload),
        };
      }
      return new HttpException(
        'Incorrect username or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return new HttpException(
      'Incorrect username or password',
      HttpStatus.UNAUTHORIZED,
    );
  }

  async userExist(email: string): Promise<boolean> {
    const userExist = await this.userModel.findOne({ email }).exec();
    if (!userExist) {
      return false;
    }

    throw new HttpException('user exist', HttpStatus.CONFLICT);
  }

  async getOne(email: string): Promise<User> {
    console.log('email=>', email);
    return await this.userModel.findOne({ email }).exec();
  }

  async deleteUser(email: string): Promise<any> {
    return await this.userModel.deleteOne({ email });
  }
}
