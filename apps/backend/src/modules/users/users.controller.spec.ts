import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUserService = {
    findOneById: jest.fn((id) => {
      const user = {
        id: +id,
        email: 'Test',
      };
      return user;
    }),
    findOneByUsername: jest.fn((email) => {
      const user = {
        id: Date.now(),
        email,
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
        email: 'Test',
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
      email: 'Test',
    });

    expect(mockUserService.findOneById).toHaveBeenCalledWith(+id);
  });

  it('should get a user by email', () => {
    const email = 'Test1';
    expect(controller.findUserByEmail(email)).toEqual({
      id: expect.any(Number),
      email,
    });

    expect(mockUserService.findOneByUsername).toHaveBeenCalledWith(email);
  });

  it('should update a user', () => {
    const id = 1;
    const dto = { email: 'Josh', password: 'newpass' } as UpdateUserDto;
    expect(controller.updateUser('1', dto)).toEqual({
      id: 1,
      email: dto.email,
    });

    expect(mockUserService.update).toHaveBeenCalledWith(id, dto);
  });

  it('should remove a user', () => {
    const id = '1';
    expect(controller.removeUser(id)).toEqual({
      id: +id,
      email: 'Test',
    });

    expect(mockUserService.remove).toHaveBeenCalledWith(+id);
  });
});
