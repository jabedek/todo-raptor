import { User } from "@@types/User";
import { createContext, useCallback, useState } from "react";
import { useEffect, useContext } from "react";
import { User as FirebaseAuthUser } from "firebase/auth";
import { getUserDetailsById } from "@@services/firebase/api/usersAPI";
import { useNavigate } from "react-router-dom";
import { listenToFirebaseAuthState, sendVerificationEmail } from "@@services/firebase/api/authAPI";

type AuthContext = {
  user: User | undefined;
  putAuth: (user: User) => void;
  clearAuth: () => void;
};

const AuthContext = createContext<AuthContext>({
  user: undefined,
  putAuth: (user: User) => {},
  clearAuth: () => {},
});

const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    listenToFirebaseAuthState(async (auth: FirebaseAuthUser | null) => {
      if (auth) {
        const user: User = {
          id: auth?.uid,
          email: auth?.email,
          displayName: auth?.displayName,
          userData: undefined,
          verification: undefined,
        };
        const userDetails = await getUserDetailsById(auth?.uid);
        if (userDetails) {
          user.userData = userDetails.userData;
          user.verification = userDetails.verification;
        }

        setTimeout(() => navigate("/account", { relative: "route" }), 500);

        putAuth(user);
      } else {
        clearAuth();
      }
    });
  }, []);

  const putAuth = (user: User) => setUser(user);
  const clearAuth = () => setUser(undefined);

  return (
    <>
      <AuthContext.Provider value={{ user, putAuth, clearAuth }}>{children}</AuthContext.Provider>
    </>
  );
};

function useAuthValue() {
  return useContext(AuthContext);
}

export { AuthContext, AuthProvider, useAuthValue };
