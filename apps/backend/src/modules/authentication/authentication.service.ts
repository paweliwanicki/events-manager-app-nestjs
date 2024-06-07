import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { AUTH_EXCEPTION_MESSAGES } from './authentication-messages';
import { User } from '../users/user.entity';
import { ConfigService } from '@nestjs/config';
import { hash, genSalt, compare } from 'bcrypt';
import { ResponseStatus } from '../../enums/ResponseStatus';
import { SignUpUserDto } from '../users/dtos/sign-up-user.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async userSignIn(email: string, password: string) {
    try {
      const user = await this.validateUser(email, password);
      if (!user)
        throw new BadRequestException({
          status: ResponseStatus.ERROR,
          message: AUTH_EXCEPTION_MESSAGES.WRONG_CREDENTIALS,
        });
      const [accessToken, refreshToken] = await Promise.all([
        this.getJwtToken(user.id, user),
        this.getRefreshToken(user.id),
      ]);

      await this.usersService.update(user.id, {
        refreshToken,
      });

      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async userSignUp(userDto: SignUpUserDto) {
    const { email, password } = userDto;
    try {
      const currentUser = await this.validateUser(email, password, false);
      if (currentUser) {
        throw new BadRequestException({
          status: ResponseStatus.ERROR,
          message: AUTH_EXCEPTION_MESSAGES.USER_IS_IN_USE,
        });
      }
      const salt = await genSalt(8);
      const hashed = await hash(password, salt);
      const user = await this.usersService.create(userDto, hashed);

      const [accessToken, refreshToken] = await Promise.all([
        this.getJwtToken(user.id, user),
        this.getRefreshToken(user.id),
      ]);

      await this.usersService.update(user.id, {
        refreshToken,
      });
      return {
        user,
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  async userSignOut(userId: number) {
    return this.usersService.update(userId, {
      refreshToken: null,
    });
  }

  async validateUser(email: string, password: string, signin = true) {
    const user = await this.usersService.findOneByEmail(email);
    if (user && signin) {
      const checkPassword = await compare(password, user.password);
      if (!checkPassword) {
        throw new BadRequestException({
          status: ResponseStatus.ERROR,
          message: AUTH_EXCEPTION_MESSAGES.WRONG_CREDENTIALS,
        });
      }
    }
    return user;
  }

  async refreshJwtToken(refreshToken: string) {
    const user = await this.usersService.findOne({ refreshToken });
    const [newAccessToken, newRefreshToken] = await Promise.all([
      this.getJwtToken(user.id, user),
      this.getRefreshToken(user.id),
    ]);
    await this.usersService.update(user.id, {
      refreshToken: newRefreshToken,
    });
    return {
      newAccessToken,
      newRefreshToken,
    };
  }

  async getRefreshToken(sub: number) {
    return await this.jwtService.signAsync(
      {
        sub,
      },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_EXPIRATION_TIME',
        ),
      },
    );
  }

  async getJwtToken(sub: number, user: User) {
    const { firstName, lastName, email, createdAt, isAdmin } = user;
    const userDetails: Partial<User> = {
      firstName,
      lastName,
      email,
      isAdmin,
      createdAt,
    };

    return await this.jwtService.signAsync(
      {
        sub,
        ...userDetails,
      },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME'),
      },
    );
  }

  validateToken(token: string, options?: JwtVerifyOptions) {
    return this.jwtService.verify(token, options);
  }
}
