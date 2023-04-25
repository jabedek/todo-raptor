import { setDoc, doc } from "firebase/firestore";
import { firebaseDB } from "@@services/firebase/firebase-config";

import { TaskTypes } from "@@types";

const saveNewTaskInDB = async (task: TaskTypes.Task) => {
  setDoc(doc(firebaseDB, "tasks", task.id), task).then(
    () => console.log(),
    (error) => console.log(error)
  );
};

const TasksAPI = {
  saveNewTaskInDB,
};

export { TasksAPI };
