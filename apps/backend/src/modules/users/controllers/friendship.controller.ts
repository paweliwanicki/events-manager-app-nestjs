import {
  Controller,
  Get,
  Param,
  Query,
  Delete,
  NotFoundException,
  UseGuards,
  Post,
} from '@nestjs/common';
import { FriendshipService } from '../services/friendship.service';
import { FRIENDSHIP_MESSAGES } from '../friendships-messages';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from 'src/modules/authentication/guards/jwt-auth.guard';
import { ResponseStatus } from 'src/enums/ResponseStatus';
import { UsersService } from '../services/users.service';
import { AUTH_EXCEPTION_MESSAGES } from 'src/modules/authentication/authentication-messages';

@Controller('user/friendship')
@UseGuards(JwtAuthGuard)
export class FriendshipController {
  constructor(
    private friendshipService: FriendshipService,
    private usersService: UsersService,
  ) {}

  @Get('/:id')
  async findFriendship(@Param('id') id: string) {
    const friendship = await this.friendshipService.findOneById(+id);
    if (!friendship) {
      throw new NotFoundException(FRIENDSHIP_MESSAGES.NOT_FOUND);
    }
    return friendship;
  }

  @Post()
  async addFriendship(
    @Query('friendId') friendId: string,
    @CurrentUser() user: User,
  ) {
    const isAlreadyFriend = await this.friendshipService.findOneById(+friendId);
    if (isAlreadyFriend) {
      throw new Error(FRIENDSHIP_MESSAGES.ALREADY_IS_FRIEND);
    }

    const friend = await this.usersService.findOneById(+friendId);
    if (!friend || !user) {
      throw new Error(AUTH_EXCEPTION_MESSAGES.NOT_FOUND);
    }

    const newFriendship = {
      user,
      friend,
    };

    await this.friendshipService.create(newFriendship);

    return {
      message: FRIENDSHIP_MESSAGES.REQUEST_SENT,
      status: ResponseStatus.SUCCESS,
    };
  }

  @Get()
  async getUserFriendshipPanel(@CurrentUser() user: User) {
    const friends = await this.friendshipService.findAllFriendsByUser(user);
    const availableUsersToInvite =
      await this.friendshipService.findAllAvailableUsersToInvite(user);

    const requestsSent = await this.friendshipService.findRequestsSentByUser(
      user,
    );
    const requestsReceived =
      await this.friendshipService.findRequestsReceivedByUser(user);

    return {
      status: ResponseStatus.SUCCESS,
      data: { friends, availableUsersToInvite, requestsSent, requestsReceived },
    };
  }

  @Delete('/:id')
  async removeFriend(@Param('id') id: string) {
    const status = await this.friendshipService.remove(+id);
    if (!status) {
      throw new Error(FRIENDSHIP_MESSAGES.REMOVE_FRIEND_ERROR);
    }
    return {
      message: FRIENDSHIP_MESSAGES.REMOVE_FRIEND,
      status: ResponseStatus.SUCCESS,
    };
  }

  @Post('/invitation')
  async acceptFriendRequest(
    @Query('friendshipId') id: string,
    @Query('isAccepted') isAccepted: boolean,
  ) {
    const request = this.friendshipService.findOneById(+id);
    if (!request) {
      throw new Error(FRIENDSHIP_MESSAGES.REQUEST_NOT_FOUND);
    }

    isAccepted
      ? await this.friendshipService.update(+id, { isAccepted: true })
      : await this.friendshipService.remove(+id);

    return {
      message: isAccepted
        ? FRIENDSHIP_MESSAGES.REQUEST_ACCEPTED
        : FRIENDSHIP_MESSAGES.REQUEST_REMOVED,
      status: ResponseStatus.SUCCESS,
    };
  }
}
