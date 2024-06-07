import type { Request } from 'express';

export const JwtCookieExtractor = (request: Request): string | null => {
  if (!request && !request.cookies) {
    return null;
  }
  return request.cookies.jwtToken;
};
