import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: number;
  @Expose()
  username: string;
  @Expose()
  isAdmin: boolean;
  @Expose()
  lang: string;
  @Expose()
  createdAt: number;
}
