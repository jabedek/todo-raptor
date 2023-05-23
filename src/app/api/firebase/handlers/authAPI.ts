import { CallbackFn } from "frotsi";
import {
  User as FirebaseAuthUser,
  Unsubscribe,
  UserCredential,
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { FirebaseApp, FirebaseAuth, FirebaseDB, FirebaseUserStateChange, UsersAPI } from "@@api/firebase";

const getCurrentFirebaseAuthUser = () => getAuth(FirebaseApp).currentUser;

const registerAuthUserInFirebase = (email: string, password: string, cb: CallbackFn) => {
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

const authenticateInFirebase = (email: string, password: string, cb: CallbackFn) => {
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
const sendVerificationEmail = (cb: CallbackFn, verifEmailsAmount: number) => {
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

const logoutInFirebase = () => signOut(FirebaseAuth);

const listenToAuthState = (cb: CallbackFn) => {
  const unsub: Unsubscribe = getAuth(FirebaseApp).onAuthStateChanged(async (auth: FirebaseAuthUser | null) =>
    cb(<FirebaseUserStateChange>{ auth, cause: "auth" }, unsub)
  );
};

const listenToIdTokenState = (cb: CallbackFn) => {
  const unsub: Unsubscribe = getAuth(FirebaseApp).onIdTokenChanged(async (auth: FirebaseAuthUser | null) =>
    cb(<FirebaseUserStateChange>{ auth, cause: "idToken" }, unsub)
  );
};

const listenToFirebaseAuthState = (cb: CallbackFn) => {
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
