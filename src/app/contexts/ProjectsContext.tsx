import { createContext, useState, useEffect, useContext } from "react";
import { Unsubscribe } from "firebase/auth";

import { ProjectTypes } from "@@types";
import { ProjectsAPI, UsersAPI } from "@@api/firebase";
import { useUserValue } from "./UserContext";
import { ProjectsTableData } from "@@components/Projects/ProjectsTable/ProjectsTable";

type ProjectsDataValue = {
  projectsData: ProjectsTableData;
  unboundAssignees: Record<string, ProjectTypes.UnboundAssignee>;
  clearProjects: () => void;
};

const ProjectsDataValue = createContext<ProjectsDataValue>({
  projectsData: {
    active: [],
    archived: [],
  },
  unboundAssignees: {},
  clearProjects: () => {},
});

let UNSUB_PROJECTS: Unsubscribe | undefined = undefined;

const ProjectsProvider = ({ children }: any) => {
  const [projectsData, setprojectsData] = useState<ProjectsTableData>({
    active: [],
    archived: [],
  });

  const [unboundAssignees, setunboundAssignees] = useState<Record<string, ProjectTypes.UnboundAssignee>>({});

  const { user, canUseAPI } = useUserValue();

  useEffect(() => {
    unsubListener();

    if (user && canUseAPI) {
      ProjectsAPI.listenToUserProjectsData(user, (data: ProjectTypes.Project[], unsubFn) => {
        UNSUB_PROJECTS = unsubFn;
        const newProjectsData = sortProjects(data);
        setprojectsData(newProjectsData);

        const projectAssignees = [...newProjectsData.active.map(({ assignees, id }) => ({ assignees, projectId: id }))];
        const assigneedIds = [...projectAssignees.map(({ assignees }) => assignees.map(({ id }) => id))].flat();
        const assigneedIdsUnique = [...new Set(assigneedIds)];

        UsersAPI.getUsersById(assigneedIdsUnique).then((users = []) => {
          const assignees: Record<string, ProjectTypes.UnboundAssignee> = {};

          users.forEach((user) => {
            assignees[user.authentication.id] = {
              id: user.authentication.id,
              email: user.authentication.email,
              names: user.personal.names,
            };
          });

          setunboundAssignees(assignees);
        });
      });
    } else {
      clearProjects();
    }

    return () => unsubListener();
  }, [user?.work.projectsIds]);

  const sortProjects = (projects: ProjectTypes.Project[]) => {
    let newProjectsData: ProjectsTableData = {
      active: [],
      archived: [],
    };
    projects.forEach((project) => {
      if (project.archived) {
        newProjectsData.archived.push(project);
      } else {
        newProjectsData.active.push(project);
      }
    });
    return newProjectsData;
  };

  const unsubListener = () => {
    if (UNSUB_PROJECTS) {
      UNSUB_PROJECTS();
      UNSUB_PROJECTS = undefined;
    }
  };

  const clearProjects = () =>
    setprojectsData({
      active: [],
      archived: [],
    });

  return (
    <ProjectsDataValue.Provider value={{ projectsData, unboundAssignees, clearProjects }}>{children}</ProjectsDataValue.Provider>
  );
};

function useProjectsValue() {
  return useContext(ProjectsDataValue);
}

export { ProjectsProvider, useProjectsValue };
