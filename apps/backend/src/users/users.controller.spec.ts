import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUserService = {
    findOneById: jest.fn((id) => {
      const user = {
        id: +id,
        username: 'Test',
      };
      return user;
    }),
    findOneByUsername: jest.fn((username) => {
      const user = {
        id: Date.now(),
        username,
      };
      return user;
    }),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update: jest.fn((id, { password, ...details }) => {
      return {
        id,
        ...details,
      };
    }),
    remove: jest.fn((id) => {
      const user = {
        id: +id,
        username: 'Test',
      };
      return user;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get a user by id', async () => {
    const id = '1';
    expect(await controller.findUser(id)).toEqual({
      id: +id,
      username: 'Test',
    });

    expect(mockUserService.findOneById).toHaveBeenCalledWith(+id);
  });

  it('should get a user by username', () => {
    const username = 'Test1';
    expect(controller.findUserByUsername(username)).toEqual({
      id: expect.any(Number),
      username,
    });

    expect(mockUserService.findOneByUsername).toHaveBeenCalledWith(username);
  });

  it('should update a user', () => {
    const id = 1;
    const dto = { username: 'Josh', password: 'newpass' };
    expect(controller.updateUser('1', dto)).toEqual({
      id: 1,
      username: dto.username,
    });

    expect(mockUserService.update).toHaveBeenCalledWith(id, dto);
  });

  it('should remove a user', () => {
    const id = '1';
    expect(controller.removeUser(id)).toEqual({
      id: +id,
      username: 'Test',
    });

    expect(mockUserService.remove).toHaveBeenCalledWith(+id);
  });
});
