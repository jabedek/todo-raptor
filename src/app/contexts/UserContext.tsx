import { CallbackFn } from "frotsi";
import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { User as FirebaseAuthUser, Unsubscribe } from "firebase/auth";

import { AuthAPI, FirebaseUserStateChange, UsersAPI } from "@@api/firebase";
import { User } from "@@types";
import { usePopupContext } from "@@components/Layout";
import { useLocalStorage } from "@@hooks";
import { AppCodeForm } from "@@components/Account";
import { StorageItem } from "../types/enums";
import { CHECK_ACCESS } from "@@api/firebase/handlers/authAPI";

type UserContext = {
  firebaseAuthUser: FirebaseAuthUser | undefined | null;
  user: User | undefined;
  logout: () => void;
  canUseAPI: boolean | undefined;
  checkAccessToAPI: (codeValue: string, callback?: CallbackFn) => Promise<any>;
};

export const UserContext = createContext<UserContext>({
  firebaseAuthUser: undefined,
  user: undefined,
  logout: () => {},
  canUseAPI: undefined,
  checkAccessToAPI: (codeValue: string, callback?: CallbackFn) => new Promise(() => {}),
});

let UNSUB_AUTH: Unsubscribe | undefined = undefined;
let UNSUB_USER: Unsubscribe | undefined = undefined;

const UserProvider = ({ children }: any) => {
  const [firebaseAuthUser, setfirebaseAuthUser] = useState<FirebaseAuthUser | undefined | null>();
  const [user, setuser] = useState<User | undefined>(undefined);
  const [canUseAPI, setcanUseAPI] = useState<boolean | undefined>();
  const navigate = useNavigate();
  // const { clearProjects } = useProjectsValue();
  const { setItem, getItem, removeItem } = useLocalStorage();
  const { showPopup } = usePopupContext();

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
    if (CHECK_ACCESS) {
      console.log("CHECK_ACCESS", CHECK_ACCESS);

      timeout = setTimeout(() => {
        if (user && firebaseAuthUser && !canUseAPI) {
          showPopup(
            <AppCodeForm
              submitFn={checkAccessToAPI}
              user={user}
              emailVerified={!!firebaseAuthUser?.emailVerified}
            />,
            true
          );
        }
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [user, canUseAPI]);

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
      const { codeValid, emailVerif } = result;
      if (codeValid) {
        setItem(StorageItem.CODE, appCode);
        if (emailVerif) {
          setcanUseAPI(true);
        }
      } else {
        removeItem(StorageItem.CODE);
        setcanUseAPI(false);
      }
      return codeValid;
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
    <UserContext.Provider value={{ firebaseAuthUser, user, logout, canUseAPI, checkAccessToAPI }}>
      {children}
    </UserContext.Provider>
  );
};

function useUserValue() {
  return useContext(UserContext);
}

export { UserProvider, useUserValue };
