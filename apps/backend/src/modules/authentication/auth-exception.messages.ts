export const AUTH_EXCEPTION_MESSAGES: Record<string, string> = {
  USER_NOT_FOUND: 'User not found!',
  USER_IS_IN_USE:
    'Unfortunately, the email address is already in use. Use a different email address and try again!',
  WRONG_CREDENTIALS:
    'The email address and password you provided are incorrect. Check the credentials you entered and try again!',
  ERROR_OCCURED: 'Error occured! Please try again!',
} as const;

export const AUTH_MESSAGES: Record<string, string> = {
  USER_REGISTERED_SUCCESS: 'User registered successfuly. Please sign in!',
  USER_REGISTERED_ERROR: 'Error occured! Please try again!',
  USER_SIGNIN_SUCCESS: 'User signed in!',
  USER_SIGNOUT_SUCCESS: 'Successfuly sign out!',
} as const;
