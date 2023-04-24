import { AuthData } from "@@types/User";
import { createContext, useState } from "react";
import { useEffect, useContext } from "react";
import { User as FirebaseAuthUser, Unsubscribe, signOut } from "firebase/auth";
import { FirebaseUserStateChange, ListenersAPI } from "@@services/api/listenersAPI";
import { firebaseAuth } from "@@services/firebase/firebase-config";
import { useNavigate } from "react-router-dom";
import { useUserDataValue } from "./UserDataContext";

type AuthContext = {
  auth: AuthData | undefined;
  putAuth: (auth: AuthData) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContext>({
  auth: undefined,
  putAuth: (auth: AuthData) => {},
  logout: () => {},
});

const Unsubscribes = new Map<string, Unsubscribe>();

const AuthProvider = ({ children }: any) => {
  const [auth, setauth] = useState<AuthData | undefined>(undefined);
  const navigate = useNavigate();
  const { clearUserAndProjectsData } = useUserDataValue();

  useEffect(() => {
    ListenersAPI.listenToFirebaseUserState(async (change: FirebaseUserStateChange, unsub0) => {
      console.log(change);

      Unsubscribes.set("listenToFirebaseUserState", unsub0);
      if (change.auth) {
        const authData: AuthData = {
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

  const putAuth = (auth: AuthData) => setauth(auth);
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
      <AuthContext.Provider value={{ auth, logout, putAuth }}>{children}</AuthContext.Provider>
    </>
  );
};

function useAuthValue() {
  return useContext(AuthContext);
}

export { AuthContext, AuthProvider, useAuthValue };
