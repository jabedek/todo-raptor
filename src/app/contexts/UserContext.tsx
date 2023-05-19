import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { User as FirebaseAuthUser, Unsubscribe } from "firebase/auth";

import { APITypes, AuthAPI, UsersAPI } from "@@api/firebase";
import { Enums, UserTypes } from "@@types";
import { useProjectsValue } from "./ProjectsContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { CallbackFn } from "frotsi";
import { usePopupContext } from "@@components/Layout";
import AppCodeForm from "@@components/Account/AppCodeForm/AppCodeForm";

// const CHECK_API = CHECK_ACCESS && CHECK_EMAIL_VERIF;

type UserContext = {
  firebaseAuthUser: FirebaseAuthUser | undefined | null;
  user: UserTypes.User | undefined;
  logout: () => void;
  canUseAPI: boolean;
  checkAccessToAPI: (codeValue: string, callback?: CallbackFn) => void;
};

export const UserContext = createContext<UserContext>({
  firebaseAuthUser: undefined,
  user: undefined,
  logout: () => {},
  canUseAPI: false,
  checkAccessToAPI: (codeValue: string, callback?: CallbackFn) => {},
});

let UNSUB_AUTH: Unsubscribe | undefined = undefined;
let UNSUB_USER: Unsubscribe | undefined = undefined;

const UserProvider = ({ children }: any) => {
  const [firebaseAuthUser, setfirebaseAuthUser] = useState<FirebaseAuthUser>();
  const [user, setuser] = useState<UserTypes.User | undefined>(undefined);
  const [canUseAPI, setcanUseAPI] = useState(false);
  const navigate = useNavigate();
  const { clearProjects } = useProjectsValue();
  const { setItem, getItem, removeItem } = useLocalStorage();
  const { showPopup } = usePopupContext();

  // 1. Listen to changes in Firebase Authentication related to current user (login, logout, timeout, etc).
  useEffect(() => {
    console.log("listenToFirebaseAuthState");

    unsubListener("all");

    AuthAPI.listenToFirebaseAuthState(async (change: APITypes.FirebaseUserStateChange, unsub0: Unsubscribe) => {
      const firebaseAuthUser: FirebaseAuthUser = change.auth;
      console.log("firebaseAuthUser", firebaseAuthUser);

      UNSUB_AUTH = unsub0;
      if (firebaseAuthUser) {
        setfirebaseAuthUser(firebaseAuthUser);
      } else {
        clear();
      }
      // console.log("[AUTH]: ", firebaseAuthUser);
    });

    return () => unsubListener("all");
  }, []);

  // 1.5

  useEffect(() => {
    const timeout = setTimeout(() => {
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

    // clears timeout before running the new effect
    return () => clearTimeout(timeout);
  }, [user, canUseAPI]);

  // 2. Listen to changes in Firebase Cloudstore related to current user (internal data changed: contacts, projects etc).
  useEffect(() => {
    console.log("listenToUserData");

    unsubListener("userData");
    checkAccessToAPI();

    if (firebaseAuthUser) {
      UsersAPI.listenToUserData(firebaseAuthUser.uid, (data: UserTypes.User, unsub1: Unsubscribe) => {
        console.log("listenToUserData", data);

        UNSUB_USER = unsub1;
        putUser(data);
        checkAccessToAPI();
      });
    }

    return () => unsubListener("userData");
  }, [firebaseAuthUser]);

  // 3. Unsubscribers for listeners

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

  // 4. Context functions
  const putUser = (user: UserTypes.User) => setuser(user);

  const clear = () => {
    setuser(undefined);
    setfirebaseAuthUser(undefined);
  };

  const checkAccessToAPI = (code: string = "", callback?: CallbackFn) => {
    const appCode: string = `${code?.length ? code : getItem(Enums.StorageItem.CODE)}`;

    AuthAPI.checkAccessToAPI(appCode)
      .then((result) => {
        if (callback) {
          callback(result);
        }
        const { codeValid, emailVerif } = result;
        if (codeValid) {
          setItem(Enums.StorageItem.CODE, appCode);
          if (emailVerif) {
            setcanUseAPI(true);
          }
        } else {
          removeItem(Enums.StorageItem.CODE);
          setcanUseAPI(false);
        }
      })
      .catch((e) => {
        if (callback) {
          callback(e);
        }
      });
  };

  // const submitCode = (codeValue: string, callback?: CallbackFn) => checkAccessToAPI(codeValue, callback);
  const logout = () => {
    AuthAPI.logoutInFirebase().then(
      () => {
        clear();
        clearProjects();
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
