import { Expose } from 'class-transformer';

export class FriendshipUserDto {
  @Expose()
  id: number;
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
}
