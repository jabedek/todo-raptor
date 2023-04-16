import { User } from "@@types/User";
import { createContext, useState } from "react";
import { useEffect } from "react";
import { StorageItem } from "@@types/common";
import { useLocalStorage } from "src/hooks/useLocalStorage";

type AuthContext = {
  user: User | undefined;
  putAuth: (user: User) => void;
  clearAuth: () => void;
};

export const AuthContext = createContext<AuthContext>({ user: undefined, putAuth: (user: User) => {}, clearAuth: () => {} });

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const { getItem, setItem } = useLocalStorage();

  useEffect(() => {
    const user = getItem(StorageItem.USER);
    if (user) {
      putAuth(JSON.parse(user));
    }
  }, []);

  const putAuth = (user: User) => {
    setUser(user);
    setItem(StorageItem.USER, JSON.stringify(user));
  };

  const clearAuth = () => {
    setUser(undefined);
    setItem(StorageItem.USER, "");
  };

  return (
    <>
      <AuthContext.Provider value={{ user, putAuth, clearAuth }}>{children}</AuthContext.Provider>
    </>
  );
};
