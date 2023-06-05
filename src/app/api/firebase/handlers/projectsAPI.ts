import { getProjectRoleDetails } from "@@components/Projects/visuals/project-visuals";
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
import { FirebaseDB } from "@@api/firebase/firebase-config";
import {
  FullAssignee,
  FullTask,
  Project,
  AssigneesRegistry,
  ProjectsFullData,
  ProjectWithAssigneesRegistry,
  SimpleAssignee,
  UnboundAssigneesRegistry,
  User,
  IdEmailPair,
} from "@@types";
import { UsersAPI } from "./usersAPI";
import { TasksAPI } from "./tasksAPI";
import { FullColumn, Schedule, SimpleColumn } from "src/app/types/Schedule";
import { ListenerCb } from "../types";

export const ProjectsRef = collection(FirebaseDB, "projects");
export const ProjectsSchedulesColumnsRef = collection(FirebaseDB, "schedules");

const saveNewProject = async (project: Project, schedule: Schedule<SimpleColumn>): Promise<void> => {
  Promise.all([
    setDoc(doc(FirebaseDB, "schedules", schedule.id), schedule),
    setDoc(doc(FirebaseDB, "projects", project.id), project),
  ]).then(
    () => {},
    (error) => console.log("Projects:", error)
  );
};

const listenScheduleColumns = async (project: Project, cb: ListenerCb<Schedule<SimpleColumn>>): Promise<void> => {
  const queryRef = doc(FirebaseDB, "schedules", project.tasksLists.scheduleId);

  const unsub: Unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
    const schedule = <Schedule<SimpleColumn>>querySnapshot.data();
    cb(querySnapshot.exists() ? schedule : undefined, unsub);
  });
};

const getScheduleFullTasks = async (
  schedule: Schedule<SimpleColumn>,
  fullAssignees: Record<string, FullAssignee>
): Promise<Schedule<FullColumn<FullTask>>> => {
  const promises: Promise<FullTask[]>[] = [
    TasksAPI.fetchTasksDataOrdered(schedule.columns.a_new.tasksIdsOrdered, fullAssignees),
    TasksAPI.fetchTasksDataOrdered(schedule.columns.b_working.tasksIdsOrdered, fullAssignees),
    TasksAPI.fetchTasksDataOrdered(schedule.columns.c_checking.tasksIdsOrdered, fullAssignees),
    TasksAPI.fetchTasksDataOrdered(schedule.columns.d_done.tasksIdsOrdered, fullAssignees),
  ];

  return Promise.all(promises).then((tasksArrays) => {
    const [a_new, b_working, c_checking, d_done] = tasksArrays;

    const fullSchedule: Schedule<FullColumn<FullTask>> = {
      ...schedule,
      columns: {
        a_new: { ...schedule.columns.a_new, tasks: a_new },
        b_working: { ...schedule.columns.b_working, tasks: b_working },
        c_checking: { ...schedule.columns.c_checking, tasks: c_checking },
        d_done: { ...schedule.columns.d_done, tasks: d_done },
      },
    };

    return fullSchedule;
  });
};

const listenProjectsWithAssigneesData = async (
  projectsIds: string[],
  getArchived: boolean,
  cb: ListenerCb<ProjectsFullData>
): Promise<void> => {
  if (!projectsIds.length) {
    cb(undefined, undefined);
  }

  const userProjectsIds = [...projectsIds];
  const queryRef = query(ProjectsRef, where("id", "in", userProjectsIds));

  const unsub: Unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
    const projects: Project[] = [];
    querySnapshot.forEach((doc) => projects.push(doc.data() as Project));

    const newProjectsData: ProjectsFullData = {
      active: [],
      archived: [],
    };
    projects.forEach((project) => {
      if (project.archived) {
        newProjectsData.archived.push({ ...project, assigneesRegistry: {} });
      } else {
        newProjectsData.active.push({ ...project, assigneesRegistry: {} });
      }
    });

    const activeAssignees = [...newProjectsData.active.map(({ assignees, id }) => ({ assignees, projectId: id }))];
    const activeAssigneedIds = [...activeAssignees.map(({ assignees }) => assignees.map(({ id }) => id))].flat();
    let uniqueIds = [...new Set(activeAssigneedIds)];
    if (getArchived) {
      const archivedAssignees = [...newProjectsData.archived.map(({ assignees, id }) => ({ assignees, projectId: id }))];
      const archivedAssigneedIds = [...archivedAssignees.map(({ assignees }) => assignees.map(({ id }) => id))].flat();
      uniqueIds = [...new Set([...archivedAssigneedIds, ...activeAssigneedIds])];
    }

    UsersAPI.getUsersById(uniqueIds)
      .then((users = []) => {
        const assignees: UnboundAssigneesRegistry = {};

        users.forEach((user) => {
          assignees[user.authentication.id] = {
            id: user.authentication.id,
            email: user.authentication.email,
            names: user.personal.names,
          };
        });

        const projectsWithRegistry: ProjectWithAssigneesRegistry[] = newProjectsData.active.map((project) => {
          const assigneesRegistry: AssigneesRegistry = {};
          project.assignees.forEach((assignee) => {
            const { id, role } = assignee;
            assigneesRegistry[id] = { ...assignees[id], role, roleDetails: getProjectRoleDetails(role) };
          });
          return { ...project, assigneesRegistry };
        });

        const projectData: ProjectsFullData = {
          active: projectsWithRegistry,
          archived: newProjectsData.archived,
        };

        cb(projectData, unsub);
      })
      .catch((e) => console.error(e));
  });
};

const getScheduleById = async (scheduleId: string): Promise<Schedule<SimpleColumn> | undefined> => {
  const docRef = doc(FirebaseDB, "schedules", scheduleId);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  return docSnap.exists() ? (data as Schedule<SimpleColumn>) : undefined;
};

const getProjectById = async (projectId: string): Promise<Project | undefined> => {
  if (!projectId) {
    return undefined;
  }

  const docRef = doc(FirebaseDB, "projects", projectId);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  return docSnap.exists() ? (data as Project) : undefined;
};

const deleteProjectTasks = async (scheduleId: string, project: Project, deleteScheduleAlso: boolean): Promise<void> => {
  return Promise.all([
    deleteScheduleWithTasks(scheduleId, deleteScheduleAlso),
    [...project.tasksLists.backlog.map((taskId) => TasksAPI.deleteTask(taskId, project.id))],
  ]).then(() => {});
};

const deleteScheduleWithTasks = async (scheduleId: string, deleteScheduleAlso: boolean): Promise<void> => {
  return getScheduleById(scheduleId)
    .then((schedule) => {
      if (schedule) {
        let tasks: string[] = [];

        Object.values(schedule.columns).forEach((col) => {
          col.tasksIdsOrdered.forEach((task) => tasks.push(task));
        });

        tasks = [...new Set(tasks)];

        Promise.all([...tasks.map((task) => TasksAPI.deleteTask(task, schedule.projectId))])
          .then(() => {
            if (deleteScheduleAlso) {
              deleteDoc(doc(FirebaseDB, "schedules", scheduleId)).catch((e) => console.error("deleteDoc schedules", e));
            }
          })
          .catch((e) => console.error("deleteTask(s)", e));
      }
    })
    .catch((e) => console.error("getScheduleById", e));
};

const deleteProjectCompletely = async (project: Project, deleteTasks: boolean): Promise<void> => {
  const projectId = project.id;
  const scheduleId = project.tasksLists.scheduleId;
  return (deleteTasks ? deleteProjectTasks(scheduleId, project, true) : new Promise(() => ({})))
    .then(() => deleteDoc(doc(FirebaseDB, "projects", projectId)))
    .catch((err) => console.error(err));
};

const archiveProjectCompletely = async (project: Project): Promise<void> =>
  updateProject({ ...project, archived: true }).catch((err) => console.error(err));

const getAssigneesDataByProjectId = async (projectId: string | null | undefined): Promise<User[]> => {
  const docs: User[] = [];

  if (!projectId) {
    return [];
  }

  const project: Project | undefined = await getProjectById(projectId);

  if (project) {
    const assigneesIds: string[] = (project?.assignees || []).map(({ id }) => id);

    if (!assigneesIds.length) {
      return [];
    }

    const queryRef = query(collection(FirebaseDB, "users"), where("authentication.id", "in", assigneesIds));
    const querySnapshot = await getDocs(queryRef);
    querySnapshot.forEach((doc) => docs.push(<User>doc.data()));
  }
  return docs;
};

const getProjectFullAssignees = async (project: Project): Promise<Record<string, FullAssignee>> => {
  const assigneesIds: string[] = [];
  const assigneesIdsRegistry: Record<string, SimpleAssignee> = {};
  const fullAssigneesRegistry: Record<string, FullAssignee> = {};

  project.assignees.forEach((assignee) => {
    assigneesIdsRegistry[assignee.id] = assignee;
    assigneesIds.push(assignee.id);
  });

  if (!assigneesIds.length) {
    return {};
  }

  const users: User[] | undefined = await UsersAPI.getUsersById(assigneesIds);

  (users || []).forEach((user) => {
    const userId = user.authentication.id;
    const full: FullAssignee = {
      ...assigneesIdsRegistry[userId],
      roleDetails: getProjectRoleDetails(assigneesIdsRegistry[userId].role),
      names: user.personal.names,
    };

    fullAssigneesRegistry[userId] = full;
  });

  return fullAssigneesRegistry;
};

const getAvailableContactsForAssigneeship = async (user: User, project: Project): Promise<IdEmailPair[]> => {
  const userContacts: string[] = user.contacts.contactsIds;
  const assignees: string[] = project.assignees.filter((m) => m.id !== user.authentication.id).map(({ id }) => id);
  const contactsNotAssigneesIds: Set<string> = new Set([...userContacts, ...assignees]);

  return UsersAPI.getUsersById([...contactsNotAssigneesIds.values()]).then((users) =>
    (users || []).map((user) => ({
      id: `${user.authentication.id}`,
      email: `${user.authentication.email}`,
    }))
  );
};

const updateProject = async (project: Project): Promise<void> => updateDoc(doc(FirebaseDB, "projects", project.id), project);

const updateSchedule = async (schedule: Schedule<SimpleColumn>): Promise<void> =>
  updateDoc(doc(FirebaseDB, "schedules", schedule.id), schedule);

const userAsAssigneeBond = async (
  assignee: SimpleAssignee,
  project: ProjectWithAssigneesRegistry,
  variant: "make" | "break"
): Promise<void> => {
  const { assigneesRegistry, ...simpleProject } = project;
  if (variant === "make") {
    simpleProject.assignees.push(assignee);
  } else {
    simpleProject.assignees = simpleProject.assignees.filter((a) => a.id !== assignee.id);
  }

  return Promise.all([
    UsersAPI.updateUserFieldsById(assignee.id, [
      { fieldPath: "work.projectsIds", value: variant === "make" ? arrayUnion(project.id) : arrayRemove(project.id) },
    ]),
    updateProject(simpleProject),
  ]).then(() => {});
};

const ProjectsAPI = {
  saveNewProject,
  getProjectById,
  deleteProjectCompletely,
  getAvailableContactsForAssigneeship,
  updateProject,
  updateSchedule,
  userAsAssigneeBond,
  getAssigneesDataByProjectId,
  //
  getProjectFullAssignees,
  //
  getScheduleFullTasks,
  getScheduleById,
  deleteScheduleWithTasks,
  archiveProjectCompletely,
  //
  listenProjectsWithAssigneesData,
  listenScheduleColumns,
};

export { ProjectsAPI };
