import { User } from "@@types/User";
import { createContext, useCallback, useState } from "react";
import { useEffect, useContext } from "react";
import { User as FirebaseAuthUser, Unsubscribe } from "firebase/auth";
import { UsersAPI } from "@@services/api/usersAPI";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "@@services/api/authAPI";
import { CallbackFn } from "frotsi";

type AuthContext = {
  user: User | undefined;
  // putAuth: (user: User) => void;
  clearAuth: () => void;
};

const AuthContext = createContext<AuthContext>({
  user: undefined,
  // putAuth: (user: User) => {},
  clearAuth: () => {},
});

const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | undefined>(undefined);

  const navigate = useNavigate();

  useEffect(() => {
    let unsubAuthListener: Unsubscribe | undefined;
    let unsubDataListener: Unsubscribe | undefined;
    AuthAPI.listenToFirebaseAuthState(async (auth: FirebaseAuthUser | null, unsub) => {
      unsubAuthListener = unsub;
      if (auth) {
        const user: User = {
          id: auth?.uid,
          email: auth?.email,
          displayName: auth?.displayName,
          userData: {
            projects: {
              projectsIdsCreated: [],
              projectsIdsManaged: [],
              projectsIdsWorking: [],
            },
            tasks: {
              tasksIdsWorking: [],
              tasksIdsCreated: [],
            },
          },
          verificationInfo: { joinedAt: "", lastVerifEmailAt: "", verifEmailsAmount: 0 },
        };
        const userDetails = await UsersAPI.getUserDetailsById(auth?.uid);
        if (userDetails) {
          user.userData = userDetails.userData;
          user.verificationInfo = userDetails.verificationInfo;
          setTimeout(() => navigate("/account", { relative: "route" }), 500);
          putAuth(user);

          AuthAPI.listenToAuthUserChanges(user.id, (data: User, unsub) => {
            console.log(data);
            unsubDataListener = unsub;
            if (data) {
              putAuth(data);
            }
          });
        } else {
          clearAuth();
        }
      } else {
        clearAuth();
      }
    });

    return () => {
      if (unsubDataListener) {
        unsubDataListener();
      }
      if (unsubAuthListener) {
        unsubAuthListener();
      }
    };
  }, []);

  const putAuth = (user: User) => setUser(user);
  const clearAuth = () => setUser(undefined);
  return (
    <>
      <AuthContext.Provider value={{ user, clearAuth }}>{children}</AuthContext.Provider>
    </>
  );
};

function useAuthValue() {
  return useContext(AuthContext);
}

export { AuthContext, AuthProvider, useAuthValue };
