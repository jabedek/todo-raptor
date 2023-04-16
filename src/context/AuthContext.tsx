import { User } from "@@types/User";
import { createContext, useState } from "react";
import { useEffect } from "react";
import { StorageItem } from "@@types/common";
import { useLocalStorage } from "src/hooks/useLocalStorage";

type AuthContext = {
  user: User | undefined;
  login: (user: User) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const { getItem, setItem } = useLocalStorage();

  useEffect(() => {
    const user = getItem(StorageItem.USER);
    if (user) {
      login(JSON.parse(user));
    }
  }, []);

  const login = (user: User) => {
    setUser(user);
    setItem(StorageItem.USER, JSON.stringify(user));
  };

  const logout = () => {
    setUser(undefined);
    setItem(StorageItem.USER, "");
  };

  return (
    <>
      <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
    </>
  );
};
