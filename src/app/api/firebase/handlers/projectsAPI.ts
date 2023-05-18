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
  return UsersAPI.getTeamMembersDataByProjectId(projectId)
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

const getAvailableContactsForMembership = (user: UserTypes.User, project: ProjectTypes.Project) => {
  const userContacts: string[] = user.contacts.contactsIds;
  const projectMembers: string[] = project.teamMembers
    .filter((m) => m.id !== user.authentication.id)
    .map(({ id }) => id) as string[];
  const contactsNotMembersIds: Set<string> = new Set([...userContacts, ...projectMembers]);

  return UsersAPI.getUsersById([...contactsNotMembersIds.values()]).then(
    (users) => {
      const members: { id: string; email: string }[] = (users || []).map((user) => ({
        id: `${user.authentication.id}`,
        email: `${user.authentication.email}`,
      }));

      return members;
    },
    (err) => console.error(err)
  );
};

const updateProject = async (project: ProjectTypes.Project) => {
  updateDoc(doc(FirebaseDB, "projects", project.id), project);
};

const userAsTeamMemberBond = async (
  member: ProjectTypes.ProjectTeamMember,
  project: ProjectTypes.Project,
  variant: "make" | "break"
) => {
  if (variant === "make") {
    project.teamMembers.push(member);
  } else {
    project.teamMembers = project.teamMembers.filter((teamMember) => teamMember.id !== member.id);
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
  getAvailableContactsForMembership,
  updateProject,
  userAsTeamMemberBond,
};

export { ProjectsAPI };
