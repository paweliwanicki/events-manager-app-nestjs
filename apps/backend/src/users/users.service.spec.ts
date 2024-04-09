import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;

  const mockUserRepository = {
    create: jest.fn().mockImplementation((dto) => ({
      ...dto,
      createdAt: Date.now(),
    })),
    save: jest.fn().mockImplementation((user) =>
      Promise.resolve({
        id: Date.now(),
        ...user,
      }),
    ),
    update: jest.fn().mockImplementation((id, attr) => ({
      id,
      ...attr,
      updatedAt: Date.now(),
    })),
    remove: jest.fn().mockImplementation((user) => user),
    findOneBy: jest.fn().mockImplementation(({ id, username }) => {
      return {
        id: id ? id : Date.now(),
        username: username ? username : 'username',
        createdAt: Date.now(),
      };
    }),
    findOne: jest.fn().mockImplementation(({ where: { id, username } }) => {
      return {
        id: id ? id : Date.now(),
        username: username ? username : 'username',
        createdAt: Date.now(),
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user record and save in repository', async () => {
    expect(await service.create('username', 'password1')).toEqual({
      id: expect.any(Number),
      username: 'username',
      password: 'password1',
      createdAt: expect.any(Number),
    });
  });

  it('should update the user', async () => {
    const id = 1;
    const updUser = {
      username: 'test',
    };
    expect(await service.update(id, updUser)).toEqual({
      id,
      ...updUser,
      updatedAt: expect.any(Number),
      createdAt: expect.any(Number),
    });
  });

  it('should remove the user', async () => {
    const user = {
      id: 1,
      username: 'username',
    };
    expect(await service.remove(1)).toEqual({
      ...user,
      createdAt: expect.any(Number),
    });
  });

  it('should find one user by id', async () => {
    const id = 1;
    expect(await service.findOneById(id)).toEqual({
      id,
      username: 'username',
      createdAt: expect.any(Number),
    });
  });

  it('should find one user by username', async () => {
    const username = 'username';
    expect(await service.findOneByUsername(username)).toEqual({
      id: expect.any(Number),
      username,
      createdAt: expect.any(Number),
    });
  });

  it('should find one user by where', async () => {
    const username = 'username';
    expect(await service.findOne({ username })).toEqual({
      id: expect.any(Number),
      username,
      createdAt: expect.any(Number),
    });
  });
});
