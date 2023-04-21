import { CallbackFn, generateDocumentId } from "frotsi";
import { firebaseApp, firebaseAuth, firebaseDB } from "../firebase/firebase-config";
import {
  User as FirebaseAuthUser,
  Unsubscribe,
  UserCredential,
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { UsersAPI } from "./usersAPI";
import { onSnapshot, doc } from "firebase/firestore";

const getCurrentFirebaseAuthUser = () => getAuth(firebaseApp).currentUser;

const listenToFirebaseAuthState = (cb: CallbackFn) => {
  const unsub: Unsubscribe = getAuth(firebaseApp).onAuthStateChanged(async (auth: FirebaseAuthUser | null) => cb(auth, unsub));
};

const listenToAuthUserChanges = (id: string | undefined | null, cb: CallbackFn) => {
  if (id) {
    const unsub: Unsubscribe = onSnapshot(doc(firebaseDB, "users", id), (doc) => {
      const data = doc.data();
      console.log("Current data: ", data);

      cb(data, unsub);
    });
  }
};

const registerAuthUserInFirebase = (email: string, password: string, cb: CallbackFn) => {
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

const authenticateInFirebase = (email: string, password: string, cb: CallbackFn) => {
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

const sendVerificationEmail = (firebaseUser: FirebaseAuthUser | null, cb: CallbackFn, verifEmailsAmount: number) => {
  if (firebaseUser) {
    sendEmailVerification(firebaseUser).then(
      () => {
        UsersAPI.updateUserFieldsById(firebaseUser.uid, [
          { fieldPath: "verificationInfo.verifEmailsAmount", value: verifEmailsAmount + 1 },
          { fieldPath: "verificationInfo.lastVerifEmailAt", value: new Date().toISOString() },
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

const AuthAPI = {
  getCurrentFirebaseAuthUser,
  listenToFirebaseAuthState,
  listenToAuthUserChanges,
  registerAuthUserInFirebase,
  authenticateInFirebase,
  sendVerificationEmail,
};

export { AuthAPI };
