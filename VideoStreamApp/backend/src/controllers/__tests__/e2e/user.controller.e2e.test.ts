import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../user.controller';
import { UserService } from '../../../services/user.service';
import { Connection, connect, Model, Collection } from 'mongoose';
import { User } from '../../../model/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { UserDTO } from 'src/model/dtos/service.dto';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { HttpStatus } from '@nestjs/common';

const baseURL = 'http://localhost:3000/api/v1/user';
describe('User Controller', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userController: UserController;
  let mongoConnection: Connection;
  let userModel: Model<User>;
  let userCollection: Collection;

  beforeAll(async () => {
    const uri =
      'mongodb://root:example@localhost:27017/Stream?authSource=admin';
    mongoConnection = (await connect(uri)).connection;
    userCollection = mongoConnection.collection('users');

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        JwtService,
        { provide: getModelToken(User.name), useValue: userModel },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  afterAll(async () => {
    await mongoConnection.destroy();
    await mongoConnection.close();
  });

  beforeEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
      await userCollection.deleteMany({});
    }
  });

  it('should be able to sign up as new user', async () => {
    const testUser: UserDTO = {
      fullname: 'testUser',
      email: 'testuser@email.com',
      password: 'PassWord@1234',
      createdDate: new Date(),
      updatedDate: new Date(),
    };

    const response = await request(baseURL).post(`/signup`).send(testUser);
    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body.newUser.email).toBe(testUser.email);
    expect(response.body.newUser.fullname).toBe(testUser.fullname);
    expect(response.body.newUser.password).toBeUndefined();
  });

  it('should always convert email into lower case', async () => {
    const testUser: UserDTO = {
      fullname: 'testUser',
      email: 'TESTUSER@email.com',
      password: 'PassWord@1234',
      createdDate: new Date(),
      updatedDate: new Date(),
    };

    const response = await request(baseURL).post(`/signup`).send(testUser);
    expect(response.status).toBe(HttpStatus.CREATED);
    expect(response.body.newUser.email).toBe('testuser@email.com');
    expect(response.body.newUser.fullname).toBe(testUser.fullname);
    expect(response.body.newUser.password).toBeUndefined();
  });

  it('Should throw error if email is invalid', async () => {
    const testUser: UserDTO = {
      fullname: 'testUser',
      email: 'testuser',
      password: 'PassWord@1234',
      createdDate: new Date(),
      updatedDate: new Date(),
    };

    const response = await request(baseURL).post(`/signup`).send(testUser);
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('Should throw error if email is invalid', async () => {
    const localUser: UserDTO = {
      fullname: 'testUser',
      email: 'TESTUSER',
      password: 'PassWord@1234',
      createdDate: new Date(),
      updatedDate: new Date(),
    };

    const response = await request(baseURL).post(`/signup`).send(localUser);
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toEqual('Invalid email id');
  });

  it('Should throw error if password is invalid', async () => {
    const localUser: UserDTO = {
      fullname: 'testUser',
      email: 'testuser@email.com',
      password: 'password',
      createdDate: new Date(),
      updatedDate: new Date(),
    };

    const response = await request(baseURL).post(`/signup`).send(localUser);
    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(response.body.message).toEqual('Password does not meet standards');
  });
});
