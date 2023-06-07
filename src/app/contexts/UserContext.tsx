import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User as FirebaseAuthUser, Unsubscribe } from "firebase/auth";

import { AuthAPI, FirebaseUserStateChange, UsersAPI, ListenersHandler } from "@@api/firebase";
import { User } from "@@types";

type UserContextType = {
  firebaseAuthUser: FirebaseAuthUser | undefined | null;
  user: User | undefined;
  logout: () => void;
};

export const UserContext = createContext<UserContextType>({
  firebaseAuthUser: undefined,
  user: undefined,
  logout: () => {},
});

const UserProvider: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const Listeners = new ListenersHandler("UserProvider");
  const [firebaseAuthUser, setfirebaseAuthUser] = useState<FirebaseAuthUser | undefined | null>();
  const [user, setuser] = useState<User | undefined>(undefined);

  const navigate = useNavigate();

  useEffect(() => {
    listenToFirebaseAuthState();
    setfirebaseAuthUser(AuthAPI.getCurrentFirebaseAuthUser());
    return () => Listeners.unsubAll();
  }, []);

  useEffect(() => {
    if (firebaseAuthUser) {
      listenToUserData(firebaseAuthUser);
    }
    return () => Listeners.unsub("userData");
  }, [firebaseAuthUser]);

  const listenToFirebaseAuthState = (): void => {
    AuthAPI.listenToFirebaseAuthState(async (change: FirebaseUserStateChange, unsub: Unsubscribe | undefined) => {
      const firebaseAuthUser: FirebaseAuthUser = change.auth;
      if (firebaseAuthUser && unsub) {
        Listeners.sub("authData", unsub);
        setfirebaseAuthUser(firebaseAuthUser);
      } else {
        clear();
      }
    });
  };

  const listenToUserData = (firebaseAuthUser: FirebaseAuthUser): void => {
    if (firebaseAuthUser) {
      UsersAPI.listenToUserData(firebaseAuthUser.uid, (data: User | undefined, unsub: Unsubscribe | undefined) => {
        if (data && unsub) {
          Listeners.sub("userData", unsub);
          putUser(data);
        }
      }).catch((e) => console.error(e));
    }
  };

  const putUser = (user: User): void => setuser(user);

  const clear = (): void => {
    setuser(undefined);
    setfirebaseAuthUser(undefined);
  };

  const logout = (): void => {
    AuthAPI.logoutInFirebase().then(
      () => {
        clear();
        navigate("/login");
      },
      (error: Error) => {
        console.error("Something went wrong while signing out:");
        console.error(error);
      }
    );
  };
  return <UserContext.Provider value={{ firebaseAuthUser, user, logout }}>{children}</UserContext.Provider>;
};

function useUserValue(): UserContextType {
  return useContext(UserContext);
}

export { UserProvider, useUserValue };
