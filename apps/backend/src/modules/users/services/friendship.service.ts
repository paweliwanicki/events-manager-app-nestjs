import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { FRIENDSHIP_MESSAGES } from '../friendships-messages';
import { Friendship } from '../entities/friendship.entity';
import { User } from '../entities/user.entity';
import { UsersService } from './users.service';
import { plainToInstance } from 'class-transformer';
import { FriendshipUserDto } from '../dtos/friendship-user.dto';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectRepository(Friendship)
    private friendshipRepository: Repository<Friendship>,
    private usersService: UsersService,
  ) {}

  create(data: Partial<Friendship>) {
    const friendship = this.friendshipRepository.create({
      ...data,
      createdAt: Math.floor(Date.now() / 1000),
    });
    return this.friendshipRepository.save(friendship);
  }

  findOneById(id: number) {
    if (!id) return null;
    return this.friendshipRepository.findOneBy({ id });
  }

  findOne(where: any) {
    return this.friendshipRepository.findOne({ where: { ...where } });
  }

  async findAllFriendsByUser(user: User) {
    const friends = await this.friendshipRepository.find({
      where: [
        { user, isAccepted: true },
        { friend: user, isAccepted: true },
      ],
      relations: { friend: true },
    });

    return friends.map(({ id, friend }) => ({
      friendshipId: id,
      ...plainToInstance(FriendshipUserDto, friend, {
        excludeExtraneousValues: true,
      }),
    }));
  }

  async findAllAvailableUsersToInvite(currentUser: User) {
    const currentFriendsAndRequests = await this.friendshipRepository.find({
      where: [{ user: currentUser }, { friend: currentUser }],
      relations: { friend: true, user: true },
    });

    const friendshipsIds = currentFriendsAndRequests.map(({ friend, user }) => {
      return friend.id === currentUser.id ? user.id : friend.id;
    });
    const users = await this.usersService.findAll({
      id: Not(In([...friendshipsIds, currentUser.id])),
    });

    return users.map((user) =>
      plainToInstance(FriendshipUserDto, user, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async findRequestsSentByUser(user: User) {
    const requests = await this.friendshipRepository.find({
      where: { user, isAccepted: false },
      relations: { friend: true },
    });
    return requests.map(({ id, friend }) => ({
      friendshipId: id,
      ...plainToInstance(FriendshipUserDto, friend, {
        excludeExtraneousValues: true,
      }),
    }));
  }

  async findRequestsReceivedByUser(user: User) {
    const requests = await this.friendshipRepository.find({
      where: { friend: user, isAccepted: false },
      relations: { user: true },
    });

    return requests.map(({ id, user }) => ({
      friendshipId: id,
      ...plainToInstance(FriendshipUserDto, user, {
        excludeExtraneousValues: true,
      }),
    }));
  }

  async update(id: number, attrs: Partial<Friendship>) {
    const friendship = await this.findOneById(id);
    if (!friendship) {
      throw new NotFoundException(FRIENDSHIP_MESSAGES.NOT_FOUND);
    }
    friendship.updatedAt = Math.floor(Date.now() / 1000);
    Object.assign(friendship, attrs);
    return this.friendshipRepository.save(friendship);
  }

  async remove(id: number) {
    const friendship = await this.findOneById(id);
    if (!friendship) {
      throw new NotFoundException(FRIENDSHIP_MESSAGES.NOT_FOUND);
    }
    return this.friendshipRepository.remove(friendship);
  }
}
