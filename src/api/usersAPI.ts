import { User as FirebaseAuthUser } from "firebase/auth";
import { setDoc, doc, getDoc, updateDoc, collection } from "firebase/firestore";
import { firebaseDB } from "@@services/firebase/firebase-config";

import { UserTypes } from "@@types";

const usersRef = collection(firebaseDB, "users");

const saveNewUserInDB = async (user: FirebaseAuthUser) => {
  const appUser: UserTypes.User = {
    authData: {
      id: user.uid,
      displayName: user.email?.split("@")[0],
      email: user.email,
    },
    userData: {
      workDetails: {
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
      verificationDetails: {
        joinedAt: new Date().toISOString(),
        verifEmailsAmount: 0,
        lastVerifEmailAt: "",
      },
      visuals: {
        colorPrimary: "",
        colorSecondary: "",
        colorTertiary: "",
      },
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

  return docSnap.exists() ? (docSnap.data() as UserTypes.User) : undefined;
};

const updateUserFull = async (user: UserTypes.User) => {
  if (!user || !user.authData.id) {
    return undefined;
  }

  updateDoc(doc(firebaseDB, "users", user.authData.id), user);
};

const updateUserFieldsById = async (id: string | null | undefined, fields: UserTypes.UserFieldUpdate[]) => {
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
