import { createContext, useState, useEffect, useContext } from "react";
import { Unsubscribe } from "firebase/auth";

import { ProjectTypes } from "@@types";
import { ProjectsAPI } from "@@api/firebase";
import { useUserValue } from "./UserContext";

export const PROJECTS_TABLE_DATA_INITIAL2 = {
  activeManaged: [],
  activeWorking: [],
  archivedManaged: [],
  archivedWorking: [],
};

type ProjectsDataValue = {
  projectsData: ProjectTypes.ProjectsTableData;
  clearProjects: () => void;
};

const ProjectsDataValue = createContext<ProjectsDataValue>({
  projectsData: {
    activeManaged: [],
    activeWorking: [],
    archivedManaged: [],
    archivedWorking: [],
  },
  clearProjects: () => {},
});

let UNSUB_PROJECTS: Unsubscribe | undefined = undefined;

const ProjectsProvider = ({ children }: any) => {
  const [projectsData, setprojectsData] = useState<ProjectTypes.ProjectsTableData>({
    activeManaged: [],
    activeWorking: [],
    archivedManaged: [],
    archivedWorking: [],
  });

  const { user, canUseAPI } = useUserValue();

  useEffect(() => {
    unsubListener();

    if (user && canUseAPI) {
      ProjectsAPI.listenToUserProjectsData(user, (data: ProjectTypes.Project[], unsubFn) => {
        UNSUB_PROJECTS = unsubFn;
        sortProjects(user.authentication.id, data);
      });
    } else {
      clearProjects();
    }

    return () => unsubListener();
  }, [user?.work.projectsIds]);

  const sortProjects = (userId, projects: ProjectTypes.Project[]) => {
    let newProjectsData: ProjectTypes.ProjectsTableData = {
      activeManaged: [],
      activeWorking: [],
      archivedManaged: [],
      archivedWorking: [],
    };
    projects.forEach((project) => {
      const isUserManager = userId === project.managerId;

      if (project.archived) {
        isUserManager ? newProjectsData.archivedManaged.push(project) : newProjectsData.archivedWorking.push(project);
      } else {
        isUserManager ? newProjectsData.activeManaged.push(project) : newProjectsData.activeWorking.push(project);
      }
    });

    setprojectsData(newProjectsData);
  };

  const unsubListener = () => {
    if (UNSUB_PROJECTS) {
      UNSUB_PROJECTS();
      UNSUB_PROJECTS = undefined;
    }
  };

  const clearProjects = () =>
    setprojectsData({
      activeManaged: [],
      activeWorking: [],
      archivedManaged: [],
      archivedWorking: [],
    });

  return <ProjectsDataValue.Provider value={{ projectsData, clearProjects }}>{children}</ProjectsDataValue.Provider>;
};

function useProjectsValue() {
  return useContext(ProjectsDataValue);
}

export { ProjectsProvider, useProjectsValue };
