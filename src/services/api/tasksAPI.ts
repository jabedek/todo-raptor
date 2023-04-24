import { setDoc, doc, addDoc } from "firebase/firestore";
import { firebaseDB } from "@@services/firebase/firebase-config";
import { Task } from "@@types/Task";

const saveNewTaskInDB = async (task: Task) => {
  setDoc(doc(firebaseDB, "tasks", task.id), task).then(
    () => console.log(),
    (error) => console.log(error)
  );
};

const TasksAPI = {
  saveNewTaskInDB,
};

export { TasksAPI };
