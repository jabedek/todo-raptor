import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Unsubscribe, signOut } from "firebase/auth";
import { firebaseAuth } from "@@services/firebase/firebase-config";

import { APITypes, ListenersAPI } from "@@api";
import { UserTypes } from "@@types";
import { useUserDataValue } from "./UserDataContext";

type AuthDataContext = {
  auth: UserTypes.AuthData | undefined;
  putAuth: (auth: UserTypes.AuthData) => void;
  logout: () => void;
};

const AuthDataContext = createContext<AuthDataContext>({
  auth: undefined,
  putAuth: (auth: UserTypes.AuthData) => {},
  logout: () => {},
});

const Unsubscribes = new Map<string, Unsubscribe>();

const AuthDataProvider = ({ children }: any) => {
  const [auth, setauth] = useState<UserTypes.AuthData | undefined>(undefined);
  const navigate = useNavigate();
  const { clearUserAndProjectsData } = useUserDataValue();

  useEffect(() => {
    ListenersAPI.listenToFirebaseUserState(async (change: APITypes.FirebaseUserStateChange, unsub0) => {
      console.log(change);

      Unsubscribes.set("listenToFirebaseUserState", unsub0);
      if (change.auth) {
        const authData: UserTypes.AuthData = {
          id: change.auth?.uid,
          email: change.auth?.email,
          displayName: change.auth?.displayName,
        };
        putAuth(authData);
      } else {
        clearAuth();
      }
    });

    return () => {
      Unsubscribes.forEach((unsub, key) => {
        unsub();
        Unsubscribes.delete(key);
      });
    };
  }, []);

  const putAuth = (auth: UserTypes.AuthData) => setauth(auth);
  const clearAuth = () => setauth(undefined);
  const logout = () => {
    signOut(firebaseAuth).then(
      () => {
        clearAuth();
        clearUserAndProjectsData();
        navigate("/");
      },
      (error: Error) => {
        console.error("Something went wrong while signing out:");
        console.error(error);
      }
    );
  };
  return (
    <>
      <AuthDataContext.Provider value={{ auth, logout, putAuth }}>{children}</AuthDataContext.Provider>
    </>
  );
};

function useAuthDataValue() {
  return useContext(AuthDataContext);
}

export { AuthDataProvider, useAuthDataValue };
