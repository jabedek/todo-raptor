import { setDoc, doc } from "firebase/firestore";

import { FirebaseDB } from "@@api/firebase";
import { TaskTypes } from "@@types";

const saveNewTaskInDB = async (task: TaskTypes.Task) => {
  setDoc(doc(FirebaseDB, "tasks", task.id), task).then(
    () => console.log(),
    (error) => console.log(error)
  );
};

const TasksAPI = {
  saveNewTaskInDB,
};

export { TasksAPI };
