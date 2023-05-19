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
  arrayRemove,
} from "firebase/firestore";

import { FirebaseDB } from "@@api/firebase/firebase-config";
import { ProjectTypes, UserTypes } from "@@types";
import { UsersAPI } from "./usersAPI";
import { CallbackFn } from "frotsi";
import { useUserValue } from "@@contexts";

export const ProjectsRef = collection(FirebaseDB, "projects");

const saveNewProject = async (project: ProjectTypes.Project) => {
  console.log(project);

  setDoc(doc(FirebaseDB, "projects", project.id), project).then(
    () => {},
    (error) => console.log("Projects:", error)
  );
};

const listenToUserProjectsData = async (user: UserTypes.User, cb: CallbackFn) => {
  if (!user) {
    return undefined;
  }

  const userProjectsIds = ["_", ...user.work.projectsIds];
  const queryRef = query(ProjectsRef, where("id", "in", userProjectsIds));

  const unsub: Unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
    let docs: ProjectTypes.Project[] = [];
    querySnapshot.forEach((doc) => {
      const project = doc.data() as ProjectTypes.Project;
      docs.push(project);
    });

    cb(docs, unsub);
  });
};

const getProjectById = async (projectId: string) => {
  if (!projectId) {
    return undefined;
  }

  const docRef = doc(FirebaseDB, "projects", projectId);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();

  return docSnap.exists() ? (data as ProjectTypes.Project) : undefined;
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

const archiveProjectById = async (userId: string, projectId: string) => {
  UsersAPI;

  updateDoc(doc(FirebaseDB, "projects", projectId), {
    archived: true,
  });
};

const changeProjectStatusById = async (userId: string, projectId: string, status: ProjectTypes.ProjectStatus) => {
  UsersAPI;

  updateDoc(doc(FirebaseDB, "projects", projectId), {
    status,
  });
};

const getAssigneesDataByProjectId = async (projectId: string | null | undefined) => {
  if (!projectId) {
    return undefined;
  }

  return getProjectById(projectId)
    .then(async (project) => {
      const assigneesIds: string[] = ["_"];
      project?.assignees.forEach(({ id }) => {
        if (id) {
          assigneesIds.push(id);
        }
      });

      const queryRef = query(collection(FirebaseDB, "users"), where("authentication.id", "in", assigneesIds));
      const querySnapshot = await getDocs(queryRef);

      const docs: UserTypes.User[] = [];
      querySnapshot.forEach((doc) => {
        docs.push(<UserTypes.User>doc.data());
      });

      return docs;
    })
    .catch((err) => console.error(err));
};

const getAvailableContactsForAssigneeship = (user: UserTypes.User, project: ProjectTypes.Project) => {
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

const updateProject = async (project: ProjectTypes.Project) => {
  updateDoc(doc(FirebaseDB, "projects", project.id), project);
};

const userAsAssigneeBond = async (
  assignee: ProjectTypes.ProjectAssigneeFull,
  project: ProjectTypes.Project,
  variant: "make" | "break"
) => {
  if (variant === "make") {
    project.assignees.push(assignee);
  } else {
    project.assignees = project.assignees.filter((assignee) => assignee.id !== assignee.id);
  }
  updateProject(project);
};

const listenToProjectData = (projectId: string | undefined | null, cb: CallbackFn) => {
  if (projectId) {
    const unsub: Unsubscribe = onSnapshot(doc(FirebaseDB, "projects", projectId), (doc) => {
      const data = doc.data();
      cb(data, unsub);
    });
  }
};

const ProjectsAPI = {
  saveNewProject,
  getProjectById,
  listenToUserProjectsData,
  listenToProjectData,
  deleteProjectById,
  getAvailableContactsForAssigneeship,
  updateProject,
  userAsAssigneeBond,
  getAssigneesDataByProjectId,
};

export { ProjectsAPI };
