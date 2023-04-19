import { User as FirebaseAuthUser } from "firebase/auth";
import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { firebaseDB } from "@@services/firebase/firebase-config";
import { User } from "@@types/User";

export const saveNewUserInDB = async (user: FirebaseAuthUser) => {
  const appUser: User = {
    id: user.uid,
    displayName: user.email?.split("@")[0],
    email: user.email,
    userData: {
      projectsIds: [],
      tasksIds: [],
      joinedAt: new Date().toISOString(),
    },
    verification: {
      verifEmailsAmount: 0,
      lastVerifEmailAt: "",
    },
  };
  console.log("saveNewUserInDB", appUser);

  setDoc(doc(firebaseDB, "users", user.uid), appUser).then(
    () => console.log(),
    (error) => console.log(error)
  );
};

export const getUserDetailsById = async (id: string | null | undefined) => {
  if (!id) {
    return undefined;
  }

  const docRef = doc(firebaseDB, "users", id);
  const docSnap = await getDoc(docRef);

  return docSnap.exists() ? (docSnap.data() as User) : undefined;
};

export const updateUserDetails = async (user: User) => {
  if (!user || !user.id) {
    return undefined;
  }

  updateDoc(doc(firebaseDB, "users", user.id), user);
};
