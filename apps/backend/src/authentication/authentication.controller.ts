import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpUserDto } from '../users/dtos/sign-up-user.dto';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { SignInUserDto } from '../users/dtos/sign-in-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from '../users/dtos/user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Response } from 'express';
import { setJwtTokensCookies } from './utils/utils';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';

@Serialize(UserDto)
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Get('/getuser')
  @Serialize(UserDto)
  @UseGuards(JwtAuthGuard)
  async getUser(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signup')
  async createUser(
    @Body() body: SignUpUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { username, password } = body;
    const { user, accessToken, refreshToken } =
      await this.authenticationService.userSignUp(username, password);

    setJwtTokensCookies(accessToken, refreshToken, response);
    return user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  async signInUser(
    @Body() body: SignInUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { username, password } = body;

    const { user, accessToken, refreshToken } =
      await this.authenticationService.userSignIn(username, password);
    setJwtTokensCookies(accessToken, refreshToken, response);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/signout')
  async signOutUser(@CurrentUser() user: User, @Res() response: Response) {
    await this.authenticationService.userSignOut(user.id);
    response
      .clearCookie('jwtToken')
      .clearCookie('refreshToken')
      .send({ statusCode: 200, message: 'ok' });
  }
}
