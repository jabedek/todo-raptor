import { CallbackFn } from "frotsi";
import {
  createUserWithEmailAndPassword,
  User as FirebaseAuthUser,
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  Unsubscribe,
  UserCredential,
} from "firebase/auth";

import { FirebaseApp, FirebaseAuth, FirebaseUserStateChange, UsersAPI } from "@@api/firebase";

const getCurrentFirebaseAuthUser = (): FirebaseAuthUser | null => getAuth(FirebaseApp).currentUser;

const registerAuthUserInFirebase = async (email: string, password: string, cb: CallbackFn): Promise<void> => {
  createUserWithEmailAndPassword(FirebaseAuth, email, password).then(
    (auth: UserCredential) => {
      cb(auth);
      /* Further behavior (setting in context, routing to '/account', etc. ) is in functions that are using this. */
    },
    (error: Error) => {
      console.error(error);
      cb(error);
    }
  );
};

const authenticateInFirebase = async (email: string, password: string, cb: CallbackFn): Promise<void> => {
  signInWithEmailAndPassword(FirebaseAuth, email, password).then(
    (auth: UserCredential) => {
      cb(auth);
      /* Further behavior (setting in context, routing to '/account', etc. ) is in functions that are using this. */
    },
    (error: Error) => {
      console.error(error);
      cb(error);
    }
  );
};
const sendVerificationEmail = async (cb: CallbackFn, verifEmailsAmount: number): Promise<void> => {
  const firebaseUser = getCurrentFirebaseAuthUser();
  if (firebaseUser) {
    sendEmailVerification(firebaseUser).then(
      () => {
        UsersAPI.updateUserFieldsById(firebaseUser.uid, [
          { fieldPath: "authentication.verifEmailsAmount", value: verifEmailsAmount + 1 },
          { fieldPath: "authentication.lastVerifEmailAt", value: new Date().toISOString() },
        ]).then(
          () => cb(),
          (err) => {
            console.error(err);
          }
        );
      },
      (error: Error) => {
        console.error(error);
        cb(error);
      }
    );
  }
};

const logoutInFirebase = async (): Promise<void> => signOut(FirebaseAuth);

const listenToAuthState = (cb: CallbackFn): void => {
  const unsub: Unsubscribe = getAuth(FirebaseApp).onAuthStateChanged(async (auth: FirebaseAuthUser | null) =>
    cb(<FirebaseUserStateChange>{ auth, cause: "auth" }, unsub)
  );
};

const listenToIdTokenState = (cb: CallbackFn): void => {
  const unsub: Unsubscribe = getAuth(FirebaseApp).onIdTokenChanged(async (auth: FirebaseAuthUser | null) =>
    cb(<FirebaseUserStateChange>{ auth, cause: "idToken" }, unsub)
  );
};

const listenToFirebaseAuthState = (cb: CallbackFn): void => {
  listenToAuthState(cb);
  listenToIdTokenState(cb);
};

const AuthAPI = {
  getCurrentFirebaseAuthUser,

  registerAuthUserInFirebase,
  sendVerificationEmail,

  authenticateInFirebase,
  logoutInFirebase,

  listenToFirebaseAuthState,
};

export { AuthAPI };
