import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  Unsubscribe,
  updateDoc,
  where,
} from "firebase/firestore";
import { FirebaseDB, ProjectsAPI, UsersAPI } from "@@api/firebase";
import { FullAssignee, FullTask, Project, SimpleTask } from "@@types";
import { getTaskStatusDetails } from "@@components/Tasks/visuals/task-visuals";
import { Schedule, ScheduleAction, SimpleColumn } from "src/app/types/Schedule";
import { handlePromiseError } from "../utils";
import { ListenerCb } from "../types";
import { log } from "console";

const TasksRef = collection(FirebaseDB, "tasks");

const saveTask = async (
  task: SimpleTask,
  project: Project,
  assigneeId: string | undefined,
  schedule: ScheduleAction
): Promise<void> => {
  const promises: Promise<void>[] = [
    setDoc(doc(FirebaseDB, "tasks", task.id), task),
    updateDoc(doc(FirebaseDB, "projects", project.id), project),
  ];

  if (schedule.column) {
    const scheduleId = project.tasksLists.scheduleId;
    if (schedule.action !== "move") {
      promises.push(
        updateDoc(doc(FirebaseDB, "schedules", scheduleId), {
          [`columns.${schedule.column}.tasksIdsOrdered`]:
            schedule.action === "add-to-schedule" ? arrayUnion(task.id) : arrayRemove(task.id),
        })
      );
    } else {
      if (schedule.column !== schedule.oldColumn) {
        promises.push(
          updateDoc(doc(FirebaseDB, "schedules", scheduleId), {
            [`columns.${schedule.column}.tasksIdsOrdered`]: arrayUnion(task.id),
            [`columns.${schedule.oldColumn}.tasksIdsOrdered`]: arrayRemove(task.id),
          })
        );
      }
    }
  }

  assigneeId?.length
    ? promises.push(updateDoc(doc(FirebaseDB, "users", assigneeId), { "work.tasksIds": arrayUnion(task.id) }))
    : undefined;

  return Promise.all(promises)
    .then(() => {})
    .catch((error) => console.log(error));
};

const getTasks = async (tasksIds: string[]): Promise<SimpleTask[]> => {
  if (!tasksIds.length) {
    return [];
  }

  const queryRef = query(TasksRef, where("id", "in", tasksIds));
  const querySnapshot = await getDocs(queryRef);
  const docs: SimpleTask[] = [];
  querySnapshot.forEach((doc) => docs.push(<SimpleTask>doc.data()));
  return docs;
};

const getTaskById = async (taskId: string): Promise<SimpleTask | undefined> => {
  const docRef = doc(FirebaseDB, "tasks", taskId);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  return docSnap.exists() ? (data as SimpleTask) : undefined;
};

const deleteTask = async (taskId: string, projectId: string): Promise<void | undefined> => {
  if (!(taskId && projectId)) {
    return undefined;
  }

  const promises: Promise<unknown>[] = [];

  return Promise.all([TasksAPI.getTaskById(taskId), ProjectsAPI.getProjectById(projectId)])
    .then(([task, project]) => {
      task?.assigneeId ? promises.push(UsersAPI.removeUserTask(task.assigneeId, task.id)) : undefined;
      promises.push(deleteDoc(doc(FirebaseDB, "tasks", taskId)));

      if (project) {
        ProjectsAPI.getScheduleById(project.tasksLists.scheduleId)
          .then((schedule) => {
            const updatedProject = {
              ...project,
              tasksLists: {
                ...project.tasksLists,
                backlog: project.tasksLists.backlog.filter((t) => t !== taskId),
              },
            };
            promises.push(updateDoc(doc(FirebaseDB, "projects", project.id), updatedProject));

            if (schedule) {
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
              promises.push(updateDoc(doc(FirebaseDB, "schedules", project.tasksLists.scheduleId), updatedSchedule));
            }
          })
          .catch((e) => console.error(e));
      }
      return Promise.all(promises)
        .then(() => {})
        .catch((error) => console.log(error));
    })
    .catch((e) => {
      handlePromiseError("deleteTask (main)", e);
    });
};

const listenToProjectOtherTasks = async (project: Project, cb: ListenerCb<SimpleTask[]>): Promise<void> => {
  const tasksIds = [...project.tasksLists.backlog];
  if (!tasksIds.length) {
    cb(undefined, undefined);
  } else {
    const queryRef = query(TasksRef, where("id", "in", tasksIds));
    const unsub: Unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
      const tasksBacklog: SimpleTask[] = [];
      querySnapshot.forEach((doc) => tasksBacklog.push(doc.data() as SimpleTask));
      cb(tasksBacklog, unsub);
    });
  }
};

const fetchTasksDataOrdered = async (tasksIds: string[], fullAssignees: Record<string, FullAssignee>): Promise<FullTask[]> => {
  if (!tasksIds.length) {
    return [];
  }
  const queryRef = query(collection(FirebaseDB, "tasks"), where("id", "in", tasksIds));
  return getDocs(queryRef).then((querySnapshot) => {
    const tasksRegistry: Record<string, SimpleTask> = {};
    querySnapshot.forEach((doc) => {
      const task = doc.data() as SimpleTask;
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

const updateTask = async (task: SimpleTask): Promise<void> => updateDoc(doc(FirebaseDB, "tasks", task.id), task);

const TasksAPI = {
  saveTask,
  deleteTask,
  getTaskById,
  getTasks,
  listenToProjectOtherTasks,
  updateTask,
  fetchTasksDataOrdered,
};

export { TasksAPI };
