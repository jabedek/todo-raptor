import { setDoc, doc, collection, Unsubscribe, onSnapshot, query, where, updateDoc, arrayUnion } from "firebase/firestore";

import { FirebaseDB, ProjectsAPI, UsersAPI } from "@@api/firebase";
import { ProjectTypes, TaskTypes, UserTypes } from "@@types";
import { CallbackFn } from "frotsi";
import { useUserValue } from "@@contexts";

const TasksRef = collection(FirebaseDB, "tasks");

const saveNewTaskInDB = async (
  task: TaskTypes.Task,
  assignee: ProjectTypes.ProjectAssignee,
  project: ProjectTypes.Project | null | undefined
) => {
  if (!project) {
    return undefined;
  }

  const promiseTasks = setDoc(doc(FirebaseDB, "tasks", task.id), task);

  const promiseProjects = updateDoc(doc(FirebaseDB, "projects", project.id), {
    tasksIds: arrayUnion(task.id),
    tasksCounter: (project?.tasksCounter || 0) + 1,
  });

  const promiseUsers = updateDoc(doc(FirebaseDB, "users", assignee.id), { "work.tasksIds": arrayUnion(task.id) });

  Promise.all([promiseTasks, promiseProjects, promiseUsers])
    .then(() => {
      console.log("Success");
    })
    .catch((error) => console.log(error));
};

const listenToTasks = async (tasksIds: string[], cb: CallbackFn) => {
  if (!tasksIds) {
    return undefined;
  }
  console.log("tasksIds", tasksIds);

  const queryRef = query(TasksRef);
  // const queryRef = query(TasksRef, where("id", "in", tasksIds));

  const unsub: Unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
    let docs: TaskTypes.Task[] = [];
    querySnapshot.forEach((doc) => {
      const task = doc.data() as TaskTypes.Task;
      docs.push(task);
    });

    console.log(docs);

    cb(docs, unsub);
  });
};

const TasksAPI = {
  saveNewTaskInDB,
  listenToTasks,
};

export { TasksAPI };
