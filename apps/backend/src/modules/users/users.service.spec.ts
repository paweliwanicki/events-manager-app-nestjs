import { Test, TestingModule } from '@nestjs/testing';
import { FriendshipService } from './services/friendship.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: FriendshipService;

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
    findOneBy: jest.fn().mockImplementation(({ id, email }) => {
      return {
        id: id ? id : Date.now(),
        email: email ? email : 'email',
        createdAt: Date.now(),
      };
    }),
    findOne: jest.fn().mockImplementation(({ where: { id, email } }) => {
      return {
        id: id ? id : Date.now(),
        email: email ? email : 'email',
        createdAt: Date.now(),
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FriendshipService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<FriendshipService>(FriendshipService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user record and save in repository', async () => {
    expect(
      await service.create(
        {
          email: 'test@com.pl',
          dateOfBirth: 0,
          firstName: 'Test1',
          lastName: 'test2',
        },
        'Password123',
      ),
    ).toEqual({
      id: expect.any(Number),
      email: 'email',
      password: 'password1',
      createdAt: expect.any(Number),
    });
  });

  it('should update the user', async () => {
    const id = 1;
    const updUser = {
      email: 'test',
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
      email: 'email',
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
      email: 'email',
      createdAt: expect.any(Number),
    });
  });

  it('should find one user by email', async () => {
    const email = 'email';
    expect(await service.findOneByEmail(email)).toEqual({
      id: expect.any(Number),
      email,
      createdAt: expect.any(Number),
    });
  });

  it('should find one user by where', async () => {
    const email = 'email';
    expect(await service.findOne({ email })).toEqual({
      id: expect.any(Number),
      email,
      createdAt: expect.any(Number),
    });
  });
});
