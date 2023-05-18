import { setDoc, doc, collection, Unsubscribe, onSnapshot, query, where } from "firebase/firestore";

import { FirebaseDB, ProjectsAPI } from "@@api/firebase";
import { ProjectTypes, TaskTypes } from "@@types";
import { CallbackFn } from "frotsi";
import { useUserValue } from "@@contexts";

const ProjectsRef = collection(FirebaseDB, "projects");
const TasksRef = collection(FirebaseDB, "tasks");

const saveNewTaskInDB = async (task: TaskTypes.Task, project: ProjectTypes.Project | null | undefined) => {
  if (!project) {
    return undefined;
  }
  setDoc(doc(FirebaseDB, "tasks", task.id), task).then(
    () => {
      const tasksCounter = (project?.tasksCounter || 0) + 1;
      ProjectsAPI.updateProject({ ...project, tasksIds: [...project.tasksIds, task.id], tasksCounter });
    },
    (error) => console.log(error)
  );
};

const listenToProjectTasks = async (tasksIds: string[], cb: CallbackFn) => {
  if (!tasksIds) {
    return undefined;
  }

  const queryRef = query(TasksRef, where("id", "in", tasksIds));

  const unsub: Unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
    let docs: TaskTypes.Task[] = [];
    querySnapshot.forEach((doc) => {
      const task = doc.data() as TaskTypes.Task;
      docs.push(task);
    });

    cb(docs, unsub);
  });
};

const TasksAPI = {
  saveNewTaskInDB,
  listenToProjectTasks,
};

export { TasksAPI };
