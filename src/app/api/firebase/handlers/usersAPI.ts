import { User as FirebaseAuthUser, Unsubscribe } from "firebase/auth";
import { setDoc, doc, getDoc, updateDoc, collection, getDocs, query, where, onSnapshot, arrayRemove } from "firebase/firestore";
import { FirebaseDB } from "@@api/firebase/firebase-config";

import { User, UserFieldUpdate } from "@@types";
import { CallbackFn } from "frotsi";

export const UsersRef = collection(FirebaseDB, "users");

const saveNewUserInDB = async (
  user: FirebaseAuthUser,
  names: {
    name: string;
    lastname: string;
    nickname: string;
  }
) => {
  const appUser: User = {
    authentication: {
      id: user.uid,
      email: user.email || "",
      verifEmailsAmount: 0,
      lastVerifEmailAt: "",
    },

    contacts: {
      contactsIds: [],
      invitationsIds: [],
    },
    personal: {
      names,
    },
    work: {
      projectsIds: [],
      tasksIds: [],
    },
  };

  setDoc(doc(FirebaseDB, "users", user.uid), appUser).then(
    () => {},
    (error) => console.log(error)
  );
};

const getUserDetailsById = async (id: string | null | undefined) => {
  if (!id) {
    return undefined;
  }

  const docRef = doc(FirebaseDB, "users", id);
  const docSnap = await getDoc(docRef);

  return docSnap.exists() ? (docSnap.data() as User) : undefined;
};

const getUserDetailsByEmail = async (email: string) => {
  if (!email) {
    return undefined;
  }

  const queryRef = query(UsersRef, where("authentication.email", "==", email));
  const querySnapshot = await getDocs(queryRef);
  const docs: User[] = [];
  querySnapshot.forEach((doc) => {
    docs.push(<User>doc.data());
  });

  return docs[0];
};

const updateUserFull = async (user: User) => {
  if (!user || !user.authentication.id) {
    return undefined;
  }

  updateDoc(doc(FirebaseDB, "users", user.authentication.id), user);
};

const removeUserTask = async (userId: string, taskId: string) =>
  updateDoc(doc(FirebaseDB, "users", userId), { "work.tasksIds": arrayRemove(taskId) });

const removeUserProject = async (userId: string, projectId: string) =>
  updateDoc(doc(FirebaseDB, "users", userId), { "work.projectsIds": arrayRemove(projectId) });

const updateUserFieldsById = async (id: string | null | undefined, fields: UserFieldUpdate[]) => {
  if (!(id && fields)) {
    return undefined;
  }

  const updateFields: any = {};
  fields.forEach(({ fieldPath, value }) => (updateFields[fieldPath] = value));
  updateDoc(doc(FirebaseDB, "users", id), updateFields);
};

const getUsersById = async (usersIds: string[]) => {
  if (!usersIds.length) {
    return undefined;
  }

  const queryRef = query(UsersRef, where("authentication.id", "in", [...usersIds]));

  const querySnapshot = await getDocs(queryRef);
  const docs: User[] = [];
  querySnapshot.forEach((doc) => {
    docs.push(<User>doc.data());
  });

  return docs;
};

// Firebase Cloud - User Data
const listenToUserData = (id: string | undefined | null, cb: CallbackFn) => {
  if (id) {
    const unsub: Unsubscribe = onSnapshot(doc(FirebaseDB, "users", id), (doc) => {
      const data = doc.data();
      cb(data, unsub);
    });
  }
};

const UsersAPI = {
  saveNewUserInDB,
  getUserDetailsById,
  getUserDetailsByEmail,

  updateUserFull,
  updateUserFieldsById,

  getUsersById,

  listenToUserData,
  removeUserTask,
  removeUserProject,
};

export { UsersAPI };
