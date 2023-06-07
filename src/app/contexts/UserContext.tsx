import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User as FirebaseAuthUser, Unsubscribe } from "firebase/auth";

import { AuthAPI, FirebaseUserStateChange, UsersAPI } from "@@api/firebase";
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

let UNSUB_AUTH: Unsubscribe | undefined = undefined;
let UNSUB_USER: Unsubscribe | undefined = undefined;

const UserProvider: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const [firebaseAuthUser, setfirebaseAuthUser] = useState<FirebaseAuthUser | undefined | null>();
  const [user, setuser] = useState<User | undefined>(undefined);

  const navigate = useNavigate();

  useEffect(() => {
    listenToFirebaseAuthState();
    setfirebaseAuthUser(AuthAPI.getCurrentFirebaseAuthUser());

    return () => unsubListener("all");
  }, []);

  useEffect(() => {
    if (firebaseAuthUser) {
      listenToUserData(firebaseAuthUser);
    }
    return () => unsubListener("userData");
  }, [firebaseAuthUser]);

  const listenToFirebaseAuthState = (): void => {
    AuthAPI.listenToFirebaseAuthState(async (change: FirebaseUserStateChange, unsub: Unsubscribe | undefined) => {
      const firebaseAuthUser: FirebaseAuthUser = change.auth;
      if (firebaseAuthUser && unsub) {
        UNSUB_AUTH = unsub;
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
          UNSUB_USER = unsub;
          putUser(data);
        }
      }).catch((e) => console.error(e));
    }
  };

  const unsubListener = (name: "auth" | "userData" | "all"): void => {
    if (["auth", "all"].includes(name) && UNSUB_AUTH) {
      UNSUB_AUTH();
      UNSUB_AUTH = undefined;
    }
    if (["userData", "all"].includes(name) && UNSUB_USER) {
      UNSUB_USER();
      UNSUB_USER = undefined;
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
