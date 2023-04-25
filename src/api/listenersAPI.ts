import { CallbackFn } from "frotsi";
import { User as FirebaseAuthUser, Unsubscribe, getAuth } from "firebase/auth";
import { onSnapshot, doc, where, query } from "firebase/firestore";
import { firebaseApp, firebaseDB } from "@@services/firebase/firebase-config";

import { ProjectTypes } from "@@types";
import { ProjectsRef, APITypes } from "@@api";

const listenToAuthState = (cb: CallbackFn) => {
  const unsub: Unsubscribe = getAuth(firebaseApp).onAuthStateChanged(async (auth: FirebaseAuthUser | null) =>
    cb(<APITypes.FirebaseUserStateChange>{ auth, cause: "auth" }, unsub)
  );
};

const listenToIdTokenState = (cb: CallbackFn) => {
  const unsub: Unsubscribe = getAuth(firebaseApp).onIdTokenChanged(async (auth: FirebaseAuthUser | null) =>
    cb(<APITypes.FirebaseUserStateChange>{ auth, cause: "idToken" }, unsub)
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
      const data: ProjectTypes.Project[] = [];
      querySnapshot.forEach((doc) => {
        data.push(<ProjectTypes.Project>doc.data());
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
