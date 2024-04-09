import type { Request } from 'express';

export const JwtCookieExtractor = (request: Request): string | null => {
  let token = null;
  if (request && request.cookies) {
    token = request.cookies.jwtToken;
  }
  return token;
};
