import { CallbackFn } from "frotsi";
import { firebaseApp, firebaseDB } from "../firebase/firebase-config";
import { User as FirebaseAuthUser, Unsubscribe, getAuth } from "firebase/auth";
import { onSnapshot, doc, where, query, getDocs } from "firebase/firestore";
import { ProjectsRef } from "./projectsAPI";
import { Project } from "@@types/Project";

export type FirebaseUserStateChange = {
  auth: FirebaseAuthUser;
  cause: "auth" | "idToken";
};

const listenToAuthState = (cb: CallbackFn) => {
  const unsub: Unsubscribe = getAuth(firebaseApp).onAuthStateChanged(async (auth: FirebaseAuthUser | null) =>
    cb(<FirebaseUserStateChange>{ auth, cause: "auth" }, unsub)
  );
};

const listenToIdTokenState = (cb: CallbackFn) => {
  const unsub: Unsubscribe = getAuth(firebaseApp).onIdTokenChanged(async (auth: FirebaseAuthUser | null) =>
    cb(<FirebaseUserStateChange>{ auth, cause: "idToken" }, unsub)
  );
};

const listenToFirebaseUserState = (cb: CallbackFn) => {
  listenToAuthState(cb);
  listenToIdTokenState(cb);
};

const listenToAuthUserData = (id: string | undefined | null, cb: CallbackFn) => {
  if (id) {
    const unsub: Unsubscribe = onSnapshot(doc(firebaseDB, "users", id), (doc) => {
      const data = doc.data();
      console.log("Current data: ", data);

      cb(data, unsub);
    });
  }
};

const listenToAuthProjectsData = (id: string | undefined | null, projectsIds: string[], cb: CallbackFn) => {
  if (id) {
    const queryRef = query(ProjectsRef, where("id", "in", [...projectsIds]));
    //;
    const unsub: Unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
      //   const querySnapshot = await getDocs(queryRef);
      const data: Project[] = [];
      querySnapshot.forEach((doc) => {
        data.push(<Project>doc.data());
      });

      console.log("Current data: ", data);
      cb(data, unsub);
    });
  }
};

const ListenersAPI = {
  listenToFirebaseUserState,
  listenToAuthUserData,
  listenToAuthProjectsData,
};

export { ListenersAPI };
