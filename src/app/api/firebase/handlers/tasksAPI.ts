import {
  setDoc,
  doc,
  collection,
  Unsubscribe,
  onSnapshot,
  query,
  updateDoc,
  arrayUnion,
  where,
  getDocs,
} from "firebase/firestore";
import { CallbackFn } from "frotsi";
import { FirebaseDB, ProjectsAPI } from "@@api/firebase";
import { SimpleTask, Project, TasksOther, FullTask, TasksSchedule } from "@@types";
import { getTaskStatusDetails } from "@@components/Tasks/visuals/task-visuals";
import { SimpleColumn, FullProjectAssignee, Schedule } from "src/app/types/Projects";

const TasksRef = collection(FirebaseDB, "tasks");

const saveNewTaskInDB = async (
  task: SimpleTask,
  project: Project | null | undefined,
  assigneeId: string,
  scheduleColumn: string
) => {
  if (!project) {
    return undefined;
  }

  const promiseTasks = setDoc(doc(FirebaseDB, "tasks", task.id), task);
  const promiseProjects = updateDoc(doc(FirebaseDB, "projects", project.id), project);

  const promises: Promise<void>[] = [promiseTasks, promiseProjects];

  if (assigneeId.length) {
    const promiseUsers = updateDoc(doc(FirebaseDB, "users", assigneeId), { "work.tasksIds": arrayUnion(task.id) });
    promises.push(promiseUsers);
  }

  if (scheduleColumn.length) {
    const scheduleId = project.tasksLists.scheduleId;
    const promiseSchedule = updateDoc(doc(FirebaseDB, "schedules", scheduleId), {
      [`columns.${scheduleColumn}.tasksIdsOrdered`]: arrayUnion(task.id),
    });
    promises.push(promiseSchedule);
  }

  Promise.all(promises)
    .then(() => {})
    .catch((error) => console.log(error));
};

const listenToProjectOtherTasks = async (project: Project, cb: CallbackFn) => {
  const tasksIds = [...project.tasksLists.backlog, ...project.tasksLists.archive];
  if (!tasksIds.length) {
    return {
      backlog: [],
      archive: [],
    };
  }

  const queryRef = query(TasksRef, where("id", "in", tasksIds));
  const unsub: Unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
    const tasksOther: TasksOther<SimpleTask> = {
      backlog: [],
      archive: [],
    };

    querySnapshot.forEach((doc) => {
      const task = doc.data() as SimpleTask;
      task.archived ? tasksOther.archive.push(task) : tasksOther.backlog.push(task);
    });
    cb(tasksOther, unsub);
  });
};

const fetchTasksDataOrdered = async (tasksIds: string[], fullAssignees: Record<string, FullProjectAssignee>) => {
  if (!tasksIds.length) {
    return [];
  }
  const queryRef = query(collection(FirebaseDB, "tasks"), where("id", "in", tasksIds));
  return getDocs(queryRef).then((querySnapshot) => {
    const tasksRegistry: Record<string, SimpleTask> = {};
    querySnapshot.forEach((doc) => {
      const task = <SimpleTask>doc.data();
      tasksRegistry[task.id] = task;
    });

    return tasksIds.map((id) => {
      const task = tasksRegistry[id];
      const assigneeDetails = fullAssignees && task?.assigneeId ? { ...fullAssignees[task.assigneeId] } : undefined;

      return {
        ...task,
        assigneeDetails,
        statusDetails: getTaskStatusDetails(task?.status),
      } as FullTask;
    });
  });
};

const updateTask = async (task: SimpleTask) => updateDoc(doc(FirebaseDB, "tasks", task.id), task);

const TasksAPI = {
  saveNewTaskInDB,
  listenToProjectOtherTasks,
  updateTask,
  fetchTasksDataOrdered,
};

export { TasksAPI };
