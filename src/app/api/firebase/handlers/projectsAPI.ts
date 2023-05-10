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

export const ProjectsRef = collection(FirebaseDB, "projects");

const saveNewProject = async (project: ProjectTypes.Project) => {
  setDoc(doc(FirebaseDB, "projects", project.id), project).then(
    () => console.log("Projects: Success"),
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
    // console.log("[PROJECTS DOCS]: ", docs);

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
  return UsersAPI.getUsersDocumentsFromProject(projectId)
    .then(async (res) => {
      deleteDoc(doc(FirebaseDB, "projects", projectId)).then(async () => {
        if (res) {
          const teamMembers = res.map((member) => {
            member.work.projectsIds = member.work.projectsIds.filter((pid) => pid !== projectId);
            return member;
          });

          await Promise.all(
            teamMembers.map((member) => {
              const memberId = member.authentication.id;
              if (memberId) {
                return updateDoc(doc(FirebaseDB, "users", memberId), member);
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

const ProjectsAPI = {
  ProjectsRef,
  saveNewProject,
  getProjectById,
  listenToUserProjectsData,
  deleteProjectById,
};

export { ProjectsAPI };
