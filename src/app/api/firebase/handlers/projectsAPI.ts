import { getProjectRoleDetails } from "@@components/Projects/visuals/project-visuals";
import { CallbackFn } from "frotsi";
import {
  setDoc,
  doc,
  where,
  collection,
  query,
  getDocs,
  getDoc,
  Unsubscribe,
  onSnapshot,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { FirebaseDB } from "@@api/firebase/firebase-config";
import {
  Project,
  FullProjectAssignee,
  ProjectAssigneesRegistry,
  ProjectsFullData,
  UnboundAssigneesRegistry,
  User,
  ProjectWithAssigneesRegistry,
  FullTask,
} from "@@types";
import { UsersAPI } from "./usersAPI";
import { FullColumn, Schedule, ScheduleColumns, SimpleColumn, SimpleProjectAssignee } from "src/app/types/Projects";
import { TasksAPI } from "./tasksAPI";

export const ProjectsRef = collection(FirebaseDB, "projects");
export const ProjectsSchedulesColumnsRef = collection(FirebaseDB, "schedules");

const saveNewProject = async (project: Project, schedule: Schedule<SimpleColumn>) => {
  Promise.all([
    setDoc(doc(FirebaseDB, "schedules", schedule.id), schedule),
    setDoc(doc(FirebaseDB, "projects", project.id), project),
  ]).then(
    () => {},
    (error) => console.log("Projects:", error)
  );
};

const listenScheduleColumns = async (project: Project, cb: CallbackFn) => {
  const queryRef = doc(FirebaseDB, "schedules", project.tasksLists.scheduleId);

  const unsub: Unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
    const schedule = <Schedule<SimpleColumn>>querySnapshot.data();
    cb(querySnapshot.exists() ? schedule : undefined, unsub);
  });
};

const getScheduleColumnsTasks = async (
  schedule: Schedule<SimpleColumn>,
  fullAssignees: Record<string, FullProjectAssignee>
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

const listenProjectsWithAssigneesData = async (projectsIds: string[], getArchived: boolean, cb: CallbackFn) => {
  if (!projectsIds.length) {
    return undefined;
  }

  const userProjectsIds = [...projectsIds];
  const queryRef = query(ProjectsRef, where("id", "in", userProjectsIds));

  const unsub: Unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
    let projects: Project[] = [];
    querySnapshot.forEach((doc) => {
      const project = doc.data() as Project;
      projects.push(project);
    });

    let newProjectsData: ProjectsFullData = {
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

    UsersAPI.getUsersById(uniqueIds).then((users = []) => {
      const assignees: UnboundAssigneesRegistry = {};

      users.forEach((user) => {
        assignees[user.authentication.id] = {
          id: user.authentication.id,
          email: user.authentication.email,
          names: user.personal.names,
        };
      });

      const projectsWithRegistry: ProjectWithAssigneesRegistry[] = newProjectsData.active.map((project) => {
        const assigneesRegistry: ProjectAssigneesRegistry = {};
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
    });
  });
};

const getScheduleById = async (scheduleId: string) => {
  const docRef = doc(FirebaseDB, "schedules", scheduleId);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();

  return docSnap.exists() ? (data as Schedule<SimpleColumn>) : undefined;
};

const getProjectById = async (projectId: string) => {
  if (!projectId) {
    return undefined;
  }

  const docRef = doc(FirebaseDB, "projects", projectId);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();

  return docSnap.exists() ? (data as Project) : undefined;
};

const getProjectScheduleById = async (project: Project) => {
  if (!project) {
    return undefined;
  }

  const docRef = doc(FirebaseDB, "schedules", project.tasksLists.scheduleId);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();

  return docSnap.exists() ? (data as Schedule<SimpleColumn>) : undefined;
};

/** Delete project in `projects` collection & in related users' `projectsIds` arrays. */
const deleteProjectById = async (projectId: string) => {
  return getAssigneesDataByProjectId(projectId)
    .then(async (res) => {
      deleteDoc(doc(FirebaseDB, "projects", projectId)).then(async () => {
        if (res) {
          const assignees = res.map((assignee) => {
            assignee.work.projectsIds = assignee.work.projectsIds.filter((pid) => pid !== projectId);
            return assignee;
          });

          await Promise.all(
            assignees.map((assignee) => {
              const assigneeId = assignee.authentication.id;
              if (assigneeId) {
                return updateDoc(doc(FirebaseDB, "users", assigneeId), assignee);
              }
            })
          );
        }
      });
    })
    .catch((err) => console.error(err));
};

const getAssigneesDataByProjectId = async (projectId: string | null | undefined) => {
  if (!projectId) {
    return undefined;
  }

  return getProjectById(projectId)
    .then(async (project) => {
      const assigneesIds: string[] = [];
      project?.assignees.forEach(({ id }) => assigneesIds.push(id));

      if (!assigneesIds.length) {
        return [];
      }

      const queryRef = query(collection(FirebaseDB, "users"), where("authentication.id", "in", assigneesIds));
      const querySnapshot = await getDocs(queryRef);

      const docs: User[] = [];
      querySnapshot.forEach((doc) => {
        docs.push(<User>doc.data());
      });

      return docs;
    })
    .catch((err) => console.error(err));
};

const getProjectFullAssignees = async (project: Project): Promise<Record<string, FullProjectAssignee>> => {
  const assigneesIds: string[] = [];
  const assigneesIdsRegistry: Record<string, SimpleProjectAssignee> = {};
  const fullAssigneesRegistry: Record<string, FullProjectAssignee> = {};

  project.assignees.forEach((assignee) => {
    assigneesIdsRegistry[assignee.id] = assignee;
    assigneesIds.push(assignee.id);
  });

  if (!assigneesIds.length) {
    return {};
  }

  return UsersAPI.getUsersById(assigneesIds).then((users: User[] = []) => {
    users.forEach((user) => {
      const userId = user.authentication.id;
      const full: FullProjectAssignee = {
        ...assigneesIdsRegistry[userId],
        roleDetails: getProjectRoleDetails(assigneesIdsRegistry[userId].role),
        names: user.personal.names,
      };

      fullAssigneesRegistry[userId] = full;
    });

    return fullAssigneesRegistry;
  });
};

const getAvailableContactsForAssigneeship = (user: User, project: Project) => {
  const userContacts: string[] = user.contacts.contactsIds;
  const projectAssignees: string[] = project.assignees
    .filter((m) => m.id !== user.authentication.id)
    .map(({ id }) => id) as string[];
  const contactsNotAssigneesIds: Set<string> = new Set([...userContacts, ...projectAssignees]);

  return UsersAPI.getUsersById([...contactsNotAssigneesIds.values()]).then(
    (users) => {
      const assignees: { id: string; email: string }[] = (users || []).map((user) => ({
        id: `${user.authentication.id}`,
        email: `${user.authentication.email}`,
      }));

      return assignees;
    },
    (err) => console.error(err)
  );
};

const updateProject = async (project: Project) => updateDoc(doc(FirebaseDB, "projects", project.id), project);

const updateSchedule = async (schedule: Schedule<SimpleColumn>) => updateDoc(doc(FirebaseDB, "schedules", schedule.id), schedule);

const userAsAssigneeBond = async (assignee: FullProjectAssignee, project: Project, variant: "make" | "break") => {
  if (variant === "make") {
    project.assignees.push(assignee);
  } else {
    project.assignees = project.assignees.filter((assignee) => assignee.id !== assignee.id);
  }
  updateProject(project);
};

const ProjectsAPI = {
  saveNewProject,
  getProjectById,
  getProjectScheduleById,
  listenProjectsWithAssigneesData,
  deleteProjectById,
  getAvailableContactsForAssigneeship,
  updateProject,
  updateSchedule,
  userAsAssigneeBond,
  getAssigneesDataByProjectId,
  //
  getProjectFullAssignees,
  //
  listenScheduleColumns,
  getScheduleColumnsTasks,
  getScheduleById,
};

export { ProjectsAPI };
