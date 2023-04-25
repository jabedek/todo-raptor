import { setDoc, doc, where, collection, query, getDocs, getDoc } from "firebase/firestore";
import { firebaseDB } from "@@services/firebase/firebase-config";

import { ProjectTypes } from "@@types";

export const ProjectsRef = collection(firebaseDB, "projects");

const saveNewProject = async (project: ProjectTypes.Project) => {
  setDoc(doc(firebaseDB, "projects", project.id), project).then(
    () => console.log("Projects: Success"),
    (error) => console.log("Projects:", error)
  );
};

const getUserProjectsManaged = async (id: string | null | undefined) => {
  if (!id) {
    return undefined;
  }

  const queryRef = query(ProjectsRef, where("manager.id", "==", id));

  const querySnapshot = await getDocs(queryRef);
  const docs: ProjectTypes.Project[] = [];
  querySnapshot.forEach((doc) => {
    docs.push(<ProjectTypes.Project>doc.data());
  });

  return docs;
};

const getUserProjectsWorking = async (id: string | null | undefined) => {
  if (!id) {
    return undefined;
  }

  const queryRef = query(ProjectsRef, where("assigneesIds", "array-contains", id));

  const querySnapshot = await getDocs(queryRef);
  const docs: ProjectTypes.Project[] = [];
  querySnapshot.forEach((doc) => {
    docs.push(<ProjectTypes.Project>doc.data());
  });

  return docs;
};

const getUserProjectsCreated = async (id: string | null | undefined) => {
  if (!id) {
    return undefined;
  }

  const queryRef = query(ProjectsRef, where("originalCreatorId", "==", id));

  const querySnapshot = await getDocs(queryRef);
  const docs: ProjectTypes.Project[] = [];
  querySnapshot.forEach((doc) => {
    docs.push(<ProjectTypes.Project>doc.data());
  });

  return docs;
};

const getUserProjectsAllSeparated = async (id: string | null | undefined) => {
  if (!id) {
    return undefined;
  }

  const result = await Promise.all([getUserProjectsManaged(id), getUserProjectsWorking(id), getUserProjectsCreated(id)]);

  return {
    projectsIdsManaged: result[0],
    projectsIdsWorking: result[1],
    projectsIdsCreated: result[2],
  };
};

const getUserProjectsAllCombined = async (id: string | null | undefined, projectsIds: string[]) => {
  if (!(id && projectsIds.length)) {
    return undefined;
  }

  console.log("0", projectsIds);

  const queryRef = query(ProjectsRef, where("id", "in", [...projectsIds]));

  const querySnapshot = await getDocs(queryRef);
  const docs: ProjectTypes.Project[] = [];
  querySnapshot.forEach((doc) => {
    docs.push(<ProjectTypes.Project>doc.data());
  });

  return docs;
};

const getProjectById = async (projectId: string) => {
  if (!projectId) {
    return undefined;
  }

  const docRef = doc(firebaseDB, "projects", projectId);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();

  console.log("4", projectId, data);

  return docSnap.exists() ? (data as ProjectTypes.Project) : undefined;
};

const ProjectsAPI = {
  ProjectsRef,
  saveNewProject,
  getUserProjectsManaged,
  getUserProjectsWorking,
  getUserProjectsCreated,
  getUserProjectsAllCombined,
  getUserProjectsAllSeparated,
  getProjectById,
};

export { ProjectsAPI };
