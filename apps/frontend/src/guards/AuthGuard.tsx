import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/userContext';

type AuthGuardType = {
  children: ReactNode;
};

export const AuthGuard = ({ children }: AuthGuardType) => {
  const { user } = useUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
