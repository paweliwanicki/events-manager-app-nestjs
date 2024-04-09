import type { Response } from 'express';

export const setJwtTokensCookies = (
  accessToken: string,
  refreshToken: string,
  response: Response,
) => {
  response.clearCookie('jwtToken');
  response.clearCookie('refreshToken');
  response.cookie('jwtToken', accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    //expires: new Date(Date.now() + 20 * 60000), // 20min -> 5min more for refresh session
  });
  response.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7d
  });
};
