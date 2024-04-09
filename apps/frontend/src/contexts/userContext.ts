import { createContext, useContext } from 'react';
import { User } from '../types/User';

type UserContextType = {
  user?: User;
  changeUser: (user?: User) => void;
};

export const UserContext = createContext<UserContextType>({
  user: undefined,
  changeUser: () => undefined,
});

export const useUser = () => useContext(UserContext);
