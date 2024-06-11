import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { USER_COOKIE_KEY } from '../utils/cookies';

type AuthGuardType = {
  children: ReactNode;
};

export const AuthGuard = ({ children }: AuthGuardType) => {
  const location = useLocation();

  const [cookies] = useCookies([USER_COOKIE_KEY]);
  const user = cookies[USER_COOKIE_KEY];

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
