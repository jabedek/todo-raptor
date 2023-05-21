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
  getDoc,
} from "firebase/firestore";
import { CallbackFn } from "frotsi";
import { FirebaseDB, ProjectsAPI, UsersAPI } from "@@api/firebase";
import { SimpleTask, Project, FullTask, TasksSchedule } from "@@types";
import { getTaskStatusDetails } from "@@components/Tasks/visuals/task-visuals";
import { SimpleColumn, FullProjectAssignee, Schedule, ScheduleAction } from "src/app/types/Projects";

const TasksRef = collection(FirebaseDB, "tasks");

const handleError = (name: string, e: any) => {
  console.error(`[${name}]: `, e);
  return e;
};

const saveTask = (task: SimpleTask, project: Project, assigneeId: string | undefined, schedule: ScheduleAction) => {
  const promises: Promise<void>[] = [
    setDoc(doc(FirebaseDB, "tasks", task.id), task).catch((e) => handleError("tasks", e)),
    updateDoc(doc(FirebaseDB, "projects", project.id), project).catch((e) => handleError("projects", e)),
  ];

  if (schedule.column) {
    const scheduleId = project.tasksLists.scheduleId;
    if (schedule.action !== "move") {
      promises.push(
        updateDoc(doc(FirebaseDB, "schedules", scheduleId), {
          [`columns.${schedule.column}.tasksIdsOrdered`]:
            schedule.action === "add-to-schedule" ? arrayUnion(task.id) : arrayRemove(task.id),
        }).catch((e) => handleError("schedule", e))
      );
    } else {
      if (schedule.column !== schedule.oldColumn) {
        promises.push(
          updateDoc(doc(FirebaseDB, "schedules", scheduleId), {
            [`columns.${schedule.column}.tasksIdsOrdered`]: arrayUnion(task.id),
            [`columns.${schedule.oldColumn}.tasksIdsOrdered`]: arrayRemove(task.id),
          }).catch((e) => handleError("schedule", e))
        );
      }
    }
  }

  assigneeId?.length
    ? promises.push(
        updateDoc(doc(FirebaseDB, "users", assigneeId), { "work.tasksIds": arrayUnion(task.id) }).catch((e) =>
          handleError("users", e)
        )
      )
    : undefined;

  return Promise.all(promises)
    .then(() => {})
    .catch((error) => console.log(error));
};

const getTasks = async (tasksIds: string[]) => {
  if (!tasksIds.length) {
    return [];
  }

  const queryRef = query(TasksRef, where("id", "in", tasksIds));

  const querySnapshot = await getDocs(queryRef);
  const docs: SimpleTask[] = [];
  querySnapshot.forEach((doc) => {
    docs.push(<SimpleTask>doc.data());
  });

  return docs;
};

const getTaskById = async (taskId: string) => {
  const docRef = doc(FirebaseDB, "tasks", taskId);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();

  return docSnap.exists() ? (data as SimpleTask) : undefined;
};

const getTaskByProjectId = async (projectId: string) => {
  const queryRef = query(TasksRef, where("projectId", "==", projectId));
  const querySnapshot = await getDocs(queryRef);
  const docs: SimpleTask[] = [];
  querySnapshot.forEach((doc) => {
    docs.push(<SimpleTask>doc.data());
  });

  return docs;
};

const deleteTask = async (taskId: string, projectId: string) => {
  if (!(taskId && projectId)) {
    return undefined;
  }

  const promises: Promise<any>[] = [];

  Promise.all([TasksAPI.getTaskById(taskId), ProjectsAPI.getProjectById(projectId)]).then(([task, project]) => {
    task?.assigneeId ? promises.push(UsersAPI.removeUserTask(task.assigneeId, task.id)) : undefined;
    promises.push(deleteDoc(doc(FirebaseDB, "tasks", taskId)));

    if (project) {
      ProjectsAPI.getScheduleById(project.tasksLists.scheduleId).then((schedule) => {
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
      });
    }
    return Promise.all(promises)
      .then(() => {})
      .catch((error) => console.log(error));
  });
};

const listenToProjectOtherTasks = async (project: Project, cb: CallbackFn) => {
  const tasksIds = [...project.tasksLists.backlog];
  if (!tasksIds.length) {
    return [];
  }

  const queryRef = query(TasksRef, where("id", "in", tasksIds));
  const unsub: Unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
    console.log(querySnapshot);

    const tasksBacklog: SimpleTask[] = [];
    querySnapshot.forEach((doc) => {
      const task = doc.data() as SimpleTask;
      tasksBacklog.push(task);
    });
    cb(tasksBacklog, unsub);
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
  getTaskByProjectId,
  getTaskById,
  getTasks,
  listenToProjectOtherTasks,
  updateTask,
  fetchTasksDataOrdered,
};

export { TasksAPI };
