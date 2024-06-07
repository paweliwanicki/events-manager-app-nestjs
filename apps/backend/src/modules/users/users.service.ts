import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { AUTH_EXCEPTION_MESSAGES } from '../authentication/authentication-messages';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  create(data: Partial<User>, password: string) {
    const { firstName, lastName, email, dateOfBirth } = data;
    const user = this.userRepository.create({
      firstName,
      lastName,
      email,
      dateOfBirth,
      password,
      createdAt: Math.floor(Date.now() / 1000),
    });
    return this.userRepository.save(user);
  }

  findOneById(id: number) {
    if (!id) return null;
    return this.userRepository.findOneBy({ id });
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findOne(where: any) {
    return this.userRepository.findOne({ where: { ...where } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOneById(id);
    if (!user) {
      throw new NotFoundException(AUTH_EXCEPTION_MESSAGES.NOT_FOUND);
    }
    user.updatedAt = Math.floor(Date.now() / 1000);
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
