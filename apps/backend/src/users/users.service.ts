import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AUTH_EXCEPTION_MESSAGES } from '../authentication/auth-exception.messages';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  create(username: string, password: string) {
    const user = this.userRepository.create({
      username,
      password,
      createdAt: Math.floor(new Date().getTime() / 1000),
    });
    return this.userRepository.save(user);
  }

  findOneById(id: number) {
    if (!id) return null;
    return this.userRepository.findOneBy({ id });
  }

  findOneByUsername(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  findOne(where: any) {
    return this.userRepository.findOne({ where: { ...where } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException(AUTH_EXCEPTION_MESSAGES.NOT_FOUND);
    }
    user.updatedAt = Math.floor(new Date().getTime() / 1000);
    Object.assign(user, attrs);
    return this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException(AUTH_EXCEPTION_MESSAGES.NOT_FOUND);
    }
    return this.userRepository.remove(user);
  }
}
