import { Project } from "@@types/Project";
import { firebaseDB } from "../firebase/firebase-config";
import { setDoc, doc, where, collection, query, getDocs, getDoc } from "firebase/firestore";

const projectsRef = collection(firebaseDB, "projects");

const saveNewProject = async (project: Project) => {
  setDoc(doc(firebaseDB, "projects", project.id), project).then(
    () => console.log("Projects: Success"),
    (error) => console.log("Projects:", error)
  );
};

const getUserProjectsManaged = async (id: string | null | undefined) => {
  if (!id) {
    return undefined;
  }

  const queryRef = query(projectsRef, where("manager.id", "==", id));

  const querySnapshot = await getDocs(queryRef);
  const docs: Project[] = [];
  querySnapshot.forEach((doc) => {
    docs.push(<Project>doc.data());
  });

  return docs;
};

const getUserProjectsWorking = async (id: string | null | undefined) => {
  if (!id) {
    return undefined;
  }

  const queryRef = query(projectsRef, where("assigneesIds", "array-contains", id));

  const querySnapshot = await getDocs(queryRef);
  const docs: Project[] = [];
  querySnapshot.forEach((doc) => {
    docs.push(<Project>doc.data());
  });

  return docs;
};

const getUserProjectsCreated = async (id: string | null | undefined) => {
  if (!id) {
    return undefined;
  }

  const queryRef = query(projectsRef, where("originalCreatorId", "==", id));

  const querySnapshot = await getDocs(queryRef);
  const docs: Project[] = [];
  querySnapshot.forEach((doc) => {
    docs.push(<Project>doc.data());
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

  const queryRef = query(projectsRef, where("id", "in", [...projectsIds]));

  const querySnapshot = await getDocs(queryRef);
  const docs: Project[] = [];
  querySnapshot.forEach((doc) => {
    docs.push(<Project>doc.data());
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

  return docSnap.exists() ? (data as Project) : undefined;
};

const ProjectsAPI = {
  saveNewProject,
  getUserProjectsManaged,
  getUserProjectsWorking,
  getUserProjectsCreated,
  getUserProjectsAllCombined,
  getUserProjectsAllSeparated,
  getProjectById,
};

export { ProjectsAPI };
