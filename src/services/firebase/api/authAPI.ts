import { CallbackFn, generateDocumentId } from "frotsi";
import { firebaseApp, firebaseAuth } from "../firebase-config";
import {
  User as FirebaseAuthUser,
  UserCredential,
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";

export const getCurrentFirebaseAuthUser = () => getAuth(firebaseApp).currentUser;

export const listenToFirebaseAuthState = (cb: CallbackFn) => {
  getAuth(firebaseApp).onAuthStateChanged(async (auth: FirebaseAuthUser | null) => {
    cb(auth);
  });
};

export const registerAuthUserInFirebase = (email: string, password: string, cb: CallbackFn) => {
  createUserWithEmailAndPassword(firebaseAuth, email, password).then(
    (auth: UserCredential) => {
      cb(auth);
      /* Further behavior (setting in context, routing to '/account', etc. ) is in AuthContext.tsx */
    },
    (error: Error) => {
      console.error(error);
      cb(error);
    }
  );
};

export const authenticateInFirebase = (email: string, password: string, cb: CallbackFn) => {
  signInWithEmailAndPassword(firebaseAuth, email, password).then(
    (auth: UserCredential) => {
      cb(auth);
      /* Further behavior (setting in context, routing to '/account', etc. ) is in AuthContext.tsx */
    },
    (error: Error) => {
      console.error(error);
      cb(error);
    }
  );
};

export const sendVerificationEmail = (firebaseUser: FirebaseAuthUser | null, cb: CallbackFn) => {
  if (firebaseUser) {
    sendEmailVerification(firebaseUser).then(
      () => cb(),
      (error: Error) => {
        console.error(error);
        cb(error);
      }
    );
  }
};
