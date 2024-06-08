import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Friendship } from './entities/friendship.entity';
import { FriendshipService } from './services/friendship.service';
import { FriendshipController } from './controllers/friendship.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Friendship])],
  providers: [UsersService, FriendshipService],
  controllers: [UsersController, FriendshipController],
  exports: [UsersService],
})
export class UsersModule {}
