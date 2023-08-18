import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { User } from '../model/user.schema';
import { UserService } from '../services/user.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { validate } from 'email-validator';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  private validateEmail(email: string) {
    const isEmail = validate(email);
    if (!isEmail)
      throw new HttpException('Invalid email id', HttpStatus.BAD_REQUEST);

    return isEmail;
  }

  private validateName(name: string) {
    if (name.length < 5) {
      throw new HttpException(
        'Name should have minimum of 5 characters',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private validatePassword(password: string) {
    const regexToMatch = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    const isValid = password.match(regexToMatch);
    if (!isValid) {
      throw new HttpException(
        'Password does not meet standards',
        HttpStatus.BAD_REQUEST,
      );
    }

    return isValid;
  }

  @Post('/signup')
  async signUp(@Res() response: Response, @Body() user: User) {
    this.validateName(user.fullname);
    this.validateEmail(user.email);
    this.validatePassword(user.password);

    const newUser = await this.userService.signup(user);
    this.logger.log('New user created');
    return response.status(HttpStatus.CREATED).json({
      newUser,
    });
  }

  @Post('/signin')
  async signIn(@Res() response: Response, @Body() user: User) {
    const token = await this.userService.signin(user, this.jwtService);
    return response.status(HttpStatus.OK).json(token);
  }

  @Get('/avatar')
  async avatar(@Res() response: Response, @Query() input: { email: string }) {
    if (!input.email || input.email.length === 0) {
      throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
    }
    const found = await this.userService.getOne(input.email);

    if (!found || !found.fullname) {
      throw new NotFoundException('Element not found');
    }
    const avatar = found.fullname.slice(0, 2);
    return response.status(HttpStatus.OK).json({ avatar });
  }
}
