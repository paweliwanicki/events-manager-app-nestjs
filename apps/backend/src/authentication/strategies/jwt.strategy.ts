import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { JwtCookieExtractor } from '../extractors/jwt-token-cookie.extractor';
import { UserDto } from '../../users/dtos/user.dto';

type JwtPayloadType = {
  sub: number;
} & UserDto;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtCookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayloadType) {
    const user = await this.usersService.findOneById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
