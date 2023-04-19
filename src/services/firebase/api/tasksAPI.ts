import { User as FirebaseAuthUser } from "firebase/auth";
import { setDoc, doc, addDoc } from "firebase/firestore";
import { firebaseDB } from "@@services/firebase/firebase-config";
import { User } from "@@types/User";
import { Task } from "@@types/Task";

export const saveNewTaskInDB = async (task: Task) => {
  setDoc(doc(firebaseDB, "tasks", task.id), task).then(
    () => console.log(),
    (error) => console.log(error)
  );
};
