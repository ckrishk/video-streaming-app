import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../user.controller';
import { UserService } from '../../../services/user.service';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { Response } from 'express';
import { UserDTO } from 'src/model/dtos/service.dto';

describe('UserController', () => {
  let userController: UserController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userService: UserService;
  const user: UserDTO = {
    fullname: 'test user',
    email: 'test@user.com',
    password: 'PassWord@1234',
    createdDate: new Date(),
    updatedDate: new Date(),
  };

  const mockUserService = {
    signup: jest.fn(),
    signin: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    userService = moduleRef.get<UserService>(UserService);
    userController = moduleRef.get<UserController>(UserController);
  });

  describe('User Controller', () => {
    it('should be able to signUp', async () => {
      const res = {} as unknown as Response;
      res.json = jest.fn().mockResolvedValue(user);
      res.status = jest.fn(() => res);

      const saved = await userController.signUp(res, { ...user });
      expect(saved).toEqual({ ...user });
    });

    it('should be able to signin', async () => {
      const res = {} as unknown as Response;
      res.json = jest.fn().mockResolvedValue('jwt-token');
      res.status = jest.fn(() => res);

      const signin = await userController.signIn(res, { ...user });
      expect(signin).toEqual('jwt-token');
    });
  });
});
