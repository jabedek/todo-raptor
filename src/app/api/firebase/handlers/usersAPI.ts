import { User as FirebaseAuthUser, Unsubscribe } from "firebase/auth";
import {
  UpdateData,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { FirebaseDB } from "@@api/firebase/firebase-config";
import { User, UserFieldUpdate } from "@@types";
import { ListenerCb } from "../types";

export const UsersRef = collection(FirebaseDB, "users");

const saveNewUserInDB = async (
  user: FirebaseAuthUser,
  names: {
    name: string;
    lastname: string;
    nickname: string;
  }
): Promise<void> => {
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

const getUserDetailsById = async (id: string | null | undefined): Promise<User | undefined> => {
  if (!id) {
    return undefined;
  }

  const docRef = doc(FirebaseDB, "users", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? (docSnap.data() as User) : undefined;
};

const getUserDetailsByEmail = async (email: string): Promise<User | undefined> => {
  if (!email) {
    return undefined;
  }

  const queryRef = query(UsersRef, where("authentication.email", "==", email));
  const querySnapshot = await getDocs(queryRef);
  const docs: User[] = [];
  querySnapshot.forEach((doc) => docs.push(doc.data() as User));
  return docs[0];
};

const updateUserFull = async (user: User): Promise<void> => {
  if (!user || !user.authentication.id) {
    return undefined;
  }

  updateDoc(doc(FirebaseDB, "users", user.authentication.id), user).catch((e) => console.error(e));
};

const addUserTask = async (userId: string, taskId: string): Promise<void> =>
  updateDoc(doc(FirebaseDB, "users", userId), { "work.tasksIds": arrayUnion(taskId) });

const addUserProject = async (userId: string, projectId: string): Promise<void> =>
  updateDoc(doc(FirebaseDB, "users", userId), { "work.projectsIds": arrayUnion(projectId) });

const removeUserTask = async (userId: string, taskId: string): Promise<void> =>
  updateDoc(doc(FirebaseDB, "users", userId), { "work.tasksIds": arrayRemove(taskId) });

const removeUserProject = async (userId: string, projectId: string): Promise<void> =>
  updateDoc(doc(FirebaseDB, "users", userId), { "work.projectsIds": arrayRemove(projectId) });

const updateUserFieldsById = async (id: string | null | undefined, fields: UserFieldUpdate[]): Promise<void> => {
  if (id && fields.length) {
    const updateFields: UpdateData<User> = {};
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    fields.forEach(({ fieldPath, value }) => (updateFields[fieldPath] = value));
    updateDoc(doc(FirebaseDB, "users", id), updateFields).catch((e) => console.error(e));
  }
};

const getUsersById = async (usersIds: string[]): Promise<User[]> => {
  if (!usersIds.length) {
    return [];
  }

  const queryRef = query(UsersRef, where("authentication.id", "in", [...usersIds]));
  const querySnapshot = await getDocs(queryRef);
  const docs: User[] = [];
  querySnapshot.forEach((doc) => docs.push(doc.data() as User));
  return docs;
};

// Firebase Cloud - User Data
const listenToUserData = async (id: string | undefined | null, cb: ListenerCb<User>): Promise<void> => {
  if (id) {
    const unsub: Unsubscribe = onSnapshot(doc(FirebaseDB, "users", id), (doc) => cb(doc.data() as User, unsub));
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

  addUserTask,
  addUserProject,
  removeUserTask,
  removeUserProject,
};

export { UsersAPI };
