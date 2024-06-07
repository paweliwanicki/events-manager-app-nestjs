import {
  Body,
  Controller,
  Get,
  Param,
  Query,
  Delete,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AUTH_EXCEPTION_MESSAGES } from '../authentication/authentication-messages';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOneById(parseInt(id));
    if (!user) {
      throw new NotFoundException(AUTH_EXCEPTION_MESSAGES.NOT_FOUND);
    }
    return user;
  }

  @Get()
  findUserByEmal(@Query('email') email: string) {
    return this.usersService.findOneByEmail(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}
