import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { User as FirebaseAuthUser, Unsubscribe } from "firebase/auth";

import { APITypes, AuthAPI, UsersAPI } from "@@api/firebase";
import { Enums, UserTypes } from "@@types";
import { useProjectsValue } from "./ProjectsContext";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { CHECK_CODE, CHECK_EMAIL_VERIF } from "@@api/firebase/handlers/authAPI";
import { CallbackFn } from "frotsi";

// const CHECK_API = CHECK_CODE && CHECK_EMAIL_VERIF;

type UserContext = {
  firebaseAuthUser: FirebaseAuthUser | undefined | null;
  user: UserTypes.User | undefined;
  logout: () => void;
  canUseAPI: boolean;
  // checkIfUserCanUseAPI?: (codeValue?: string) => void;
  submitCode: (codeValue: string, callback?: CallbackFn) => void;
};

const UserContext = createContext<UserContext>({
  firebaseAuthUser: undefined,
  user: undefined,
  logout: () => {},
  canUseAPI: false,
  // checkIfUserCanUseAPI: (codeValue?: string) => {},
  submitCode: (codeValue: string, callback?: CallbackFn) => {},
});

let UNSUB_AUTH: Unsubscribe | undefined = undefined;
let UNSUB_USER: Unsubscribe | undefined = undefined;

const UserProvider = ({ children }: any) => {
  const [firebaseAuthUser, setfirebaseAuthUser] = useState<FirebaseAuthUser>();
  const [user, setuser] = useState<UserTypes.User | undefined>(undefined);
  const [canUseAPI, setcanUseAPI] = useState(false);
  const [code, setcode] = useState("");
  const navigate = useNavigate();
  const { clearProjects } = useProjectsValue();
  const { value, setItem, getItem, removeItem } = useLocalStorage();

  // 1. Listen to changes in Firebase Authentication related to current user (login, logout, timeout, etc).
  useEffect(() => {
    unsubAuthListener();

    AuthAPI.listenToFirebaseAuthState(async (change: APITypes.FirebaseUserStateChange, unsub0: Unsubscribe) => {
      const firebaseAuthUser: FirebaseAuthUser = change.auth;

      UNSUB_AUTH = unsub0;
      if (firebaseAuthUser) {
        setfirebaseAuthUser(firebaseAuthUser);
      } else {
        clear();
      }
      // console.log("[AUTH]: ", firebaseAuthUser);
    });

    return () => unsubAuthListener();
  }, []);

  // 2. Listen to changes in Firebase Cloudstore related to current user (internal data changed: contacts, projects etc).
  useEffect(() => {
    unsubUserListener();
    checkIfUserCanUseAPI();

    if (firebaseAuthUser) {
      UsersAPI.getUserDetailsById(firebaseAuthUser.uid).then((change: UserTypes.User | undefined) => {
        if (change) {
          const user: UserTypes.User = {
            authentication: change.authentication,
            contacts: change.contacts,
            work: change.work,
            personal: change.personal,
          };

          putUser(user);

          UsersAPI.listenToUserData(user.authentication.id, (data: UserTypes.User, unsub1: Unsubscribe) => {
            UNSUB_USER = unsub1;
            putUser(data);
            checkIfUserCanUseAPI();
          });
        }
      });
    }

    return () => unsubUserListener();
  }, [firebaseAuthUser]);

  // 3. Unsubscribers for listeners
  const unsubAuthListener = () => {
    if (UNSUB_AUTH) {
      UNSUB_AUTH();
      UNSUB_AUTH = undefined;
    }
  };

  const unsubUserListener = () => {
    if (UNSUB_USER) {
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

  const checkIfUserCanUseAPI = (callback?: CallbackFn) => {
    const appCode: string = `${code?.length ? code : getItem(Enums.StorageItem.CODE)}`;
    AuthAPI.checkIfUserCanUseAPI(appCode)
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

  const submitCode = (codeValue: string, callback?: CallbackFn) => {
    setcode(codeValue);
    checkIfUserCanUseAPI(callback);
  };

  const logout = () => {
    AuthAPI.logoutInFirebase().then(
      () => {
        clear();
        clearProjects();
        // clearTasksData();
        navigate("/");
      },
      (error: Error) => {
        console.error("Something went wrong while signing out:");
        console.error(error);
      }
    );
  };
  return (
    <UserContext.Provider value={{ firebaseAuthUser, user, logout, canUseAPI, submitCode }}>{children}</UserContext.Provider>
  );
};

function useUserValue() {
  return useContext(UserContext);
}

export { UserProvider, useUserValue };
