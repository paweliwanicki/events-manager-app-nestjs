import { useState, ReactNode, useMemo, useCallback, useEffect } from "react";
import { User } from "../types/User";
import { UserContext } from "../contexts/userContext";
import { useCookies } from "react-cookie";
import {
  COOKIES_EXPIRE_TIME,
  USER_COOKIE_KEY,
  userCookie,
} from "../utils/cookies";

type UserProviderProps = {
  children: ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | undefined>();
  const [cookies, setCookie, removeCookie] = useCookies();

  const { key, expires } = userCookie();
  const changeUser = useCallback(
    (newUser?: User) => {
      setUser(newUser);
      if (!newUser && user?.sub) {
        removeCookie(key);
        return;
      }
      if (newUser?.sub) {
        setCookie(key, newUser, {
          expires: new Date(expires),
          secure: true,
        });
      }
    },
    [key, expires, user, removeCookie, setCookie]
  );

  useEffect(() => {
    if (user) {
      return;
    }
    setUser(cookies[USER_COOKIE_KEY]);
  }, [user, cookies]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("/api/auth/getUser")
        .then(({ status }) => {
          if (status === 200) {
            const timestamp = Date.now();
            const expires = timestamp + COOKIES_EXPIRE_TIME;
            setCookie(key, user, {
              expires: new Date(expires),
              secure: true,
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }, 60 * 50000);

    return () => {
      clearInterval(interval);
    };
  }, [setCookie, key, user, cookies]);

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
