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

import { APITypes, FirebaseApp, FirebaseAuth, FirebaseDB, UsersAPI } from "@@api/firebase";
import { onSnapshot, doc, getDoc, setDoc } from "firebase/firestore";
import { useLocalStorage } from "@@hooks";
import { Enums } from "@@types";
import { AppCode } from "../types";

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

// Listener - Firebase Authentication
const listenToAuthState = (cb: CallbackFn) => {
  const unsub: Unsubscribe = getAuth(FirebaseApp).onAuthStateChanged(async (auth: FirebaseAuthUser | null) =>
    cb(<APITypes.FirebaseUserStateChange>{ auth, cause: "auth" }, unsub)
  );
};

const listenToIdTokenState = (cb: CallbackFn) => {
  const unsub: Unsubscribe = getAuth(FirebaseApp).onIdTokenChanged(async (auth: FirebaseAuthUser | null) =>
    cb(<APITypes.FirebaseUserStateChange>{ auth, cause: "idToken" }, unsub)
  );
};

const listenToFirebaseAuthState = (cb: CallbackFn) => {
  listenToAuthState(cb);
  listenToIdTokenState(cb);
  // setCodes();
};

// Code

export const CHECK_CODE = import.meta.env.VITE_REACT_APP_check_Code === "yes";
export const CHECK_EMAIL_VERIF = import.meta.env.VITE_REACT_APP_check_EmailVerif === "yes";

const setCodes = async () => {
  const codes: AppCode[] = [
    {
      id: "03f6-4fc0-469e-85b5",
      isoStart: "2023-05-01T00:00:00.000Z",
      isoEnd: "2023-05-31T00:00:00.000Z",
    },
    {
      id: "365c-dff7-4f38-9aae",
      isoStart: "2023-06-01T00:00:00.000Z",
      isoEnd: "2023-05-30T00:00:00.000Z",
    },
  ];

  Promise.all([
    setDoc(doc(FirebaseDB, "codes", codes[0].id), codes[0]),
    setDoc(doc(FirebaseDB, "codes", codes[1].id), codes[1]),
  ]).then(
    () => {
      console.log("Success");
    },
    (e) => console.log(e)
  );
};

const checkIfUserCanUseAPI = async (codeValue = "") => {
  const emailVerif = !CHECK_EMAIL_VERIF || !!getCurrentFirebaseAuthUser()?.emailVerified;
  let codeValid = false;
  if (!CHECK_CODE) {
    codeValid = true;
  }

  if (!codeValue) {
    codeValid = false;
  }

  const docSnap = await getDoc(doc(FirebaseDB, "codes", codeValue));

  if (!docSnap.exists()) {
    codeValid = false;
  }

  const { isoEnd, isoStart } = docSnap.data() as AppCode;
  const today = new Date(new Date().toISOString());

  codeValid = new Date(isoEnd) >= today && today >= new Date(isoStart);

  return { codeValid, emailVerif };
};

const AuthAPI = {
  getCurrentFirebaseAuthUser,

  registerAuthUserInFirebase,
  sendVerificationEmail,

  authenticateInFirebase,
  logoutInFirebase,

  listenToFirebaseAuthState,
  //
  setCodes,
  checkIfUserCanUseAPI,
};

export { AuthAPI };