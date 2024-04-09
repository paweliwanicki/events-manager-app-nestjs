import { useState, ReactNode, useMemo, useCallback } from 'react';
import { User } from '../types/User';
import { UserContext } from '../contexts/userContext';

type UserProviderProps = {
  children: ReactNode;
};

const getCurrentUser = (): User | undefined => {
  const currentUser = sessionStorage.getItem('user');
  return currentUser ? (JSON.parse(currentUser) as User) : undefined;
};

const setCurrentUser = (user: User | undefined) => {
  user
    ? sessionStorage.setItem('user', JSON.stringify(user))
    : sessionStorage.removeItem('user');
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | undefined>(() => getCurrentUser());

  const changeUser = useCallback((user?: User) => {
    setUser(user);
    setCurrentUser(user);
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      changeUser,
    }),
    [user, changeUser]
  );

  return (
    <UserContext.Provider value={contextValue}>
      <>{children}</>
    </UserContext.Provider>
  );
};
