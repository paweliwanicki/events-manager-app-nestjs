export const USER_COOKIE_KEY = 'events_manager_user_666';
export const COOKIES_EXPIRE_TIME = 90000;

const getUserCookie = () => {
  const timestamp = Date.now();
  const expires = timestamp + COOKIES_EXPIRE_TIME;
  return () => {
    return {
      timestamp,
      expires,
      key: USER_COOKIE_KEY,
    };
  };
};

export const userCookie = getUserCookie();
