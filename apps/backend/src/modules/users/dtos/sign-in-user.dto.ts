import { IsNotEmpty, IsString } from 'class-validator';

export class SignInUserDto {
  @IsString()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
