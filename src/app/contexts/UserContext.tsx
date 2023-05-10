import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { User as FirebaseAuthUser, Unsubscribe } from "firebase/auth";

import { APITypes, AuthAPI, UsersAPI } from "@@api/firebase";
import { UserTypes } from "@@types";
import { useProjectsValue } from "./ProjectsContext";

type UserContext = {
  firebaseAuthUser: FirebaseAuthUser | undefined | null;
  user: UserTypes.User | undefined;
  logout: () => void;
};

const UserContext = createContext<UserContext>({
  firebaseAuthUser: undefined,
  user: undefined,
  logout: () => {},
});

let UNSUB_AUTH: Unsubscribe | undefined = undefined;
let UNSUB_USER: Unsubscribe | undefined = undefined;

const UserProvider = ({ children }: any) => {
  const [firebaseAuthUser, setfirebaseAuthUser] = useState<FirebaseAuthUser>();
  const [user, setuser] = useState<UserTypes.User | undefined>(undefined);
  const navigate = useNavigate();
  const { clearProjects } = useProjectsValue();

  // 1. Listen to changes in Firebase Authentication related to current user (login, logout, timeout, etc).
  useEffect(() => {
    unsubAuthListener();

    AuthAPI.listenToFirebaseAuthState(async (change: APITypes.FirebaseUserStateChange, unsub0: Unsubscribe) => {
      // console.log("1. Listen to changes in Firebase Authentication related to current user (login, logout, timeout, etc).");

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

    if (firebaseAuthUser) {
      UsersAPI.getUserDetailsById(firebaseAuthUser.uid).then((change: UserTypes.User | undefined) => {
        if (change) {
          // console.log("change", change);

          const user: UserTypes.User = {
            authentication: change.authentication,
            contacts: change.contacts,
            work: change.work,
            personal: change.personal,
          };

          putUser(user);

          UsersAPI.listenToUserData(user.authentication.id, (data: UserTypes.User, unsub1: Unsubscribe) => {
            // console.log("2. Listen to changes in Firebase Cloudstore related to current user (internal data changed: contacts, projects etc).");

            UNSUB_USER = unsub1;
            putUser(data);
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
  return <UserContext.Provider value={{ firebaseAuthUser, user, logout }}>{children}</UserContext.Provider>;
};

function useUserValue() {
  return useContext(UserContext);
}

export { UserProvider, useUserValue };
