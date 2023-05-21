import { CallbackFn } from "frotsi";
import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { User as FirebaseAuthUser, Unsubscribe } from "firebase/auth";

import { AuthAPI, FirebaseUserStateChange, UsersAPI } from "@@api/firebase";
import { StorageItem, User } from "@@types";
import { usePopupContext } from "@@components/Layout";
// import { useProjectsValue } from "@@contexts";
import { useLocalStorage } from "@@hooks";
import { AppCodeForm } from "@@components/Account";

type UserContext = {
  firebaseAuthUser: FirebaseAuthUser | undefined | null;
  user: User | undefined;
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
  const [firebaseAuthUser, setfirebaseAuthUser] = useState<FirebaseAuthUser | undefined | null>();
  const [user, setuser] = useState<User | undefined>(undefined);
  const [canUseAPI, setcanUseAPI] = useState(false);
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
    console.log("listenToUserData");

    unsubListener("userData");
    checkAccessToAPI();

    if (firebaseAuthUser) {
      UsersAPI.listenToUserData(firebaseAuthUser.uid, (data: User, unsub1: Unsubscribe) => {
        console.log("listenToUserData", data);

        UNSUB_USER = unsub1;
        putUser(data);
        checkAccessToAPI();
      });
    }

    return () => unsubListener("userData");
  }, [firebaseAuthUser]);

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

  const checkAccessToAPI = (code: string = "", callback?: CallbackFn) => {
    const appCode: string = `${code?.length ? code : getItem(StorageItem.CODE)}`;

    AuthAPI.checkAccessToAPI(appCode)
      .then((result) => {
        if (callback) {
          callback(result);
        }
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
      })
      .catch((e) => {
        if (callback) {
          callback(e);
        }
      });
  };

  const logout = () => {
    AuthAPI.logoutInFirebase().then(
      () => {
        clear();
        // clearProjects();
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
