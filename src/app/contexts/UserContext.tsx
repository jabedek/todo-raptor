import { CallbackFn } from "frotsi";
import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { User as FirebaseAuthUser, Unsubscribe } from "firebase/auth";

import { AuthAPI, FirebaseUserStateChange, UsersAPI } from "@@api/firebase";
import { User } from "@@types";
import { useLocalStorage } from "@@hooks";
import { AppCodeForm } from "@@components/Account";
import { StorageItem } from "../types/enums";
import { CHECK_ACCESS } from "@@api/firebase/handlers/authAPI";

type UserContext = {
  firebaseAuthUser: FirebaseAuthUser | undefined | null;
  user: User | undefined;
  logout: () => void;
  canUseAPI: boolean | undefined;
  codeNeeded: boolean | undefined;
  emailNeeded: boolean | undefined;
  checkAccessToAPI: (codeValue: string, callback?: CallbackFn) => Promise<any>;
};

export const UserContext = createContext<UserContext>({
  firebaseAuthUser: undefined,
  user: undefined,
  logout: () => {},
  canUseAPI: undefined,
  codeNeeded: undefined,
  emailNeeded: undefined,
  checkAccessToAPI: (codeValue: string, callback?: CallbackFn) => new Promise(() => {}),
});

let UNSUB_AUTH: Unsubscribe | undefined = undefined;
let UNSUB_USER: Unsubscribe | undefined = undefined;

const UserProvider = ({ children }: any) => {
  const [firebaseAuthUser, setfirebaseAuthUser] = useState<FirebaseAuthUser | undefined | null>();
  const [user, setuser] = useState<User | undefined>(undefined);
  const [canUseAPI, setcanUseAPI] = useState<boolean | undefined>();
  const [codeNeeded, setcodeNeeded] = useState<boolean | undefined>();
  const [emailNeeded, setemailNeeded] = useState<boolean | undefined>();
  const navigate = useNavigate();
  const { setItem, getItem, removeItem } = useLocalStorage();

  useEffect(() => {
    setfirebaseAuthUser(AuthAPI.getCurrentFirebaseAuthUser());
    unsubListener("all");

    AuthAPI.listenToFirebaseAuthState(async (change: FirebaseUserStateChange, unsub0: Unsubscribe) => {
      const firebaseAuthUser: FirebaseAuthUser = change.auth;
      UNSUB_AUTH = unsub0;
      setfirebaseAuthUser(firebaseAuthUser);
      if (!firebaseAuthUser) {
        clear();
      }
    });

    return () => unsubListener("all");
  }, []);

  useEffect(() => {
    unsubListener("userData");
    checkAccessToAPI();

    if (firebaseAuthUser) {
      UsersAPI.listenToUserData(firebaseAuthUser.uid, (data: User, unsub1: Unsubscribe) => {
        UNSUB_USER = unsub1;
        putUser(data);
        checkAccessToAPI();
      });
    }

    return () => unsubListener("userData");
  }, [firebaseAuthUser]);

  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    timeout = setTimeout(() => {
      setcodeNeeded(!!(CHECK_ACCESS && user && firebaseAuthUser && !canUseAPI));
      setemailNeeded(!!(CHECK_ACCESS && user && !firebaseAuthUser?.emailVerified));
    }, 1500);

    return () => clearTimeout(timeout);
  }, [user, firebaseAuthUser, canUseAPI]);

  const unsubListener = (name: "auth" | "userData" | "all") => {
    if (["auth", "all"].includes(name) && UNSUB_AUTH) {
      UNSUB_AUTH();
      UNSUB_AUTH = undefined;
    }
    if (["userData", "all"].includes(name) && UNSUB_USER) {
      UNSUB_USER();
      UNSUB_USER = undefined;
    }
  };

  const putUser = (user: User) => setuser(user);

  const clear = () => {
    setuser(undefined);
    setfirebaseAuthUser(undefined);
  };

  const checkAccessToAPI = async (code: string = "") => {
    const appCode: string = `${code?.length ? code : getItem(StorageItem.CODE)}`;

    return AuthAPI.checkAccessToAPI(appCode).then((result) => {
      if (result) {
        setItem(StorageItem.CODE, appCode);
        setcanUseAPI(true);
      } else {
        removeItem(StorageItem.CODE);
        setcanUseAPI(false);
      }
      return result;
    });
  };

  const logout = () => {
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
  return (
    <UserContext.Provider value={{ firebaseAuthUser, user, logout, canUseAPI, checkAccessToAPI, codeNeeded, emailNeeded }}>
      {children}
    </UserContext.Provider>
  );
};

function useUserValue() {
  return useContext(UserContext);
}

export { UserProvider, useUserValue };
