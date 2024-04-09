export const AUTH_EXCEPTION_MESSAGES: Record<string, string> = {
  USER_NOT_FOUND: 'User not found!',
  USER_IS_IN_USE:
    'Unfortunately, the username is already in use. Use a different username and try again.',
  WRONG_CREDENTIALS:
    'The username and password you provided are incorrect. Check the credentials you entered and try again.',
} as const;
