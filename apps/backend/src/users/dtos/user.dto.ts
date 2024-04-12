import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: number;
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
  @Expose()
  isAdmin: boolean;
  @Expose()
  lang: string;
  @Expose()
  createdAt: number;
}
