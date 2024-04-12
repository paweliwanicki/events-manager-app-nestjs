import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpUserDto } from '../users/dtos/sign-up-user.dto';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { SignInUserDto } from '../users/dtos/sign-in-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from '../users/dtos/user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response } from 'express';
import { setJwtTokensCookies } from './utils/utils';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { AUTH_MESSAGES } from './auth-exception.messages';
import { ResponseStatus } from 'src/enums/ResponseStatus';

@Serialize(UserDto) // interceptor
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
    try {
      const { accessToken, refreshToken } =
        await this.authenticationService.userSignUp(body);
      if (accessToken) {
        setJwtTokensCookies(accessToken, refreshToken, response);
        response.send({
          status: ResponseStatus.SUCCESS,
          message: AUTH_MESSAGES.USER_REGISTERED_SUCCESS,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  @Post('/signin')
  async signInUser(
    @Body() body: SignInUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { email, password } = body;
    try {
      const { accessToken, refreshToken } =
        await this.authenticationService.userSignIn(email, password);
      if (accessToken) {
        setJwtTokensCookies(accessToken, refreshToken, response);
        response.send({
          status: ResponseStatus.SUCCESS,
          jwtToken: accessToken,
          message: AUTH_MESSAGES.USER_SIGNIN_SUCCESS,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('/signout')
  async signOutUser(@CurrentUser() user: User, @Res() response: Response) {
    await this.authenticationService.userSignOut(user.id);
    response.clearCookie('jwtToken').clearCookie('refreshToken').send({
      statusCode: 200,
      message: AUTH_MESSAGES.USER_SIGNOUT_SUCCESS,
    });
  }
}
