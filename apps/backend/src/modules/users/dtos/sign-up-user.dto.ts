import { IsNumber, IsString, Matches } from 'class-validator';
import { Match } from '../../../decorators/match.decorator';

export class SignUpUserDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;
  @IsString()
  email: string;

  @IsNumber()
  dateOfBirth: number;
  @IsString()
  @Matches(
    '^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\\-__+.]){1,}).{8,}$',
  )
  password: string;
  @IsString()
  @Match('password')
  confirmPassword: string;
}
