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
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import { CallbackFn } from "frotsi";
import { FirebaseDB, ProjectsAPI } from "@@api/firebase";
import { SimpleTask, Project, TasksOther, FullTask, TasksSchedule } from "@@types";
import { getTaskStatusDetails } from "@@components/Tasks/visuals/task-visuals";
import { SimpleColumn, FullProjectAssignee, Schedule } from "src/app/types/Projects";

const TasksRef = collection(FirebaseDB, "tasks");

const saveTask = async (
  task: SimpleTask,
  project: Project | null | undefined,
  assigneeId: string,
  schedule: { column: string; action: "add" | "remove" }
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

  if (schedule.column.length) {
    const scheduleId = project.tasksLists.scheduleId;
    const promiseSchedule = updateDoc(doc(FirebaseDB, "schedules", scheduleId), {
      [`columns.${schedule.column}.tasksIdsOrdered`]: schedule.action === "add" ? arrayUnion(task.id) : arrayRemove(task.id),
    });
    promises.push(promiseSchedule);
  }

  return Promise.all(promises)
    .then(() => {})
    .catch((error) => console.log(error));
};

const deleteTask = async (taskId: string, projectId: string, assigneeId = "") => {
  if (!(taskId && projectId)) {
    return undefined;
  }

  return ProjectsAPI.getProjectById(projectId).then((project) => {
    if (!project) {
      return undefined;
    }

    return ProjectsAPI.getScheduleById(project.tasksLists.scheduleId).then((schedule) => {
      if (!schedule) {
        return undefined;
      }

      const updatedProject = {
        ...project,
        tasksLists: {
          ...project.tasksLists,
          backlog: project.tasksLists.backlog.filter((t) => t !== taskId),
          archive: project.tasksLists.archive.filter((t) => t !== taskId),
        },
      };

      const updatedSchedule: Schedule<SimpleColumn> = {
        ...schedule,
        columns: {
          a_new: {
            ...schedule.columns.a_new,
            tasksIdsOrdered: schedule.columns.a_new.tasksIdsOrdered.filter((t) => t !== taskId),
          },
          b_working: {
            ...schedule.columns.b_working,
            tasksIdsOrdered: schedule.columns.b_working.tasksIdsOrdered.filter((t) => t !== taskId),
          },
          c_checking: {
            ...schedule.columns.c_checking,
            tasksIdsOrdered: schedule.columns.c_checking.tasksIdsOrdered.filter((t) => t !== taskId),
          },
          d_done: {
            ...schedule.columns.d_done,
            tasksIdsOrdered: schedule.columns.d_done.tasksIdsOrdered.filter((t) => t !== taskId),
          },
        },
      };

      console.group("deleteTask");
      console.table(updatedProject);
      console.table(updatedSchedule);
      console.groupEnd();

      const promise: Promise<void>[] = [];
      assigneeId
        ? promise.push(updateDoc(doc(FirebaseDB, "users", assigneeId), { "work.tasksIds": arrayRemove(taskId) }))
        : undefined;

      return Promise.all([
        deleteDoc(doc(FirebaseDB, "tasks", taskId)),
        updateDoc(doc(FirebaseDB, "projects", project.id), updatedProject),
        updateDoc(doc(FirebaseDB, "schedules", project.tasksLists.scheduleId), updatedSchedule),
        ...promise,
      ])
        .then(() => {})
        .catch((error) => console.log(error));
    });
  });
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
  saveTask,
  deleteTask,
  listenToProjectOtherTasks,
  updateTask,
  fetchTasksDataOrdered,
};

export { TasksAPI };
