import { User as FirebaseAuthUser } from "firebase/auth";
import { setDoc, doc, getDoc, updateDoc, arrayUnion, collection } from "firebase/firestore";
import { firebaseDB } from "@@services/firebase/firebase-config";
import { User, UserData, UserFieldUpdate } from "@@types/User";

const usersRef = collection(firebaseDB, "users");

const saveNewUserInDB = async (user: FirebaseAuthUser) => {
  const appUser: User = {
    id: user.uid,
    displayName: user.email?.split("@")[0],
    email: user.email,
    userData: {
      projects: {
        projectsIdsCreated: [],
        projectsIdsManaged: [],
        projectsIdsWorking: [],
      },
      tasks: {
        tasksIdsWorking: [],
        tasksIdsCreated: [],
      },
    },
    verificationInfo: {
      joinedAt: new Date().toISOString(),
      verifEmailsAmount: 0,
      lastVerifEmailAt: "",
    },
  };

  setDoc(doc(firebaseDB, "users", user.uid), appUser).then(
    () => console.log(),
    (error) => console.log(error)
  );
};

const getUserDetailsById = async (id: string | null | undefined) => {
  if (!id) {
    return undefined;
  }

  const docRef = doc(firebaseDB, "users", id);
  const docSnap = await getDoc(docRef);

  return docSnap.exists() ? (docSnap.data() as User) : undefined;
};

const updateUserFull = async (user: User) => {
  if (!user || !user.id) {
    return undefined;
  }

  updateDoc(doc(firebaseDB, "users", user.id), user);
};

const updateUserFieldsById = async (id: string | null | undefined, fields: UserFieldUpdate[]) => {
  if (!(id && fields)) {
    return undefined;
  }

  const updateFields: any = {};
  fields.forEach(({ fieldPath, value }) => (updateFields[fieldPath] = value));
  updateDoc(doc(firebaseDB, "users", id), updateFields);
};

const UsersAPI = {
  saveNewUserInDB,
  getUserDetailsById,
  updateUserFull,
  updateUserFieldsById,
};

export { UsersAPI };
