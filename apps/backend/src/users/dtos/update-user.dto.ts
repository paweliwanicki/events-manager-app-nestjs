import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  password: string;
}
