import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthenticationService } from '../authentication.service';
import { JwtCookieExtractor } from '../extractors/jwt-token-cookie.extractor';
import { AUTH_TOKEN_MESSAGES } from '../authentication-messages';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private configService: ConfigService,
    private authService: AuthenticationService,
  ) {
    super({
      ignoreExpiration: true,
      passReqToCallback: true,
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([JwtCookieExtractor]),
    });
  }

  async validate(request: Request, payload: any) {
    const refreshToken = request.cookies['refreshToken'];
    if (!payload || !refreshToken) {
      throw new BadRequestException(
        AUTH_TOKEN_MESSAGES.REFRESH_TOKEN_NOT_VALID,
      );
    }
    this.authService.validateToken(refreshToken, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
    return { ...payload, refreshToken };
  }
}
