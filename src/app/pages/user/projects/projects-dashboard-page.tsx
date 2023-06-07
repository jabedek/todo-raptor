import { useEffect, useState } from "react";
import { Unsubscribe } from "firebase/auth";

import { ProjectsAPI } from "@@api/firebase";
import { ProjectsTable } from "@@components/Projects";
import { useUserValue, useApiAccessValue } from "@@contexts";
import { ProjectsSeparated } from "@@types";

enum ListenerDataName {
  project = "project",
}
let UNSUB_PROJECTS: Unsubscribe | undefined = undefined;

const ProjectsDashboardPage: React.FC = () => {
  const { user } = useUserValue();

  const { canAccessAPI } = useApiAccessValue();
  const [projectsData, setprojectsData] = useState<ProjectsSeparated>({ active: [], archived: [] });

  useEffect(() => {
    if (user && canAccessAPI) {
      listenProjectsWithAssigneesData([...user.work.projectsIds]);
    } else {
      clearProjects();
    }

    return () => unsubListener();
  }, [user]);

  const listenProjectsWithAssigneesData = (projectsIds: string[]): void => {
    unsubListener();
    ProjectsAPI.listenProjectsWithAssigneesData(
      projectsIds,
      false,
      (data: ProjectsSeparated | undefined, unsub: Unsubscribe | undefined) => {
        if (data && unsub) {
          UNSUB_PROJECTS = unsub;
          setprojectsData(data);
        }
      }
    ).catch((e) => console.error(e));
  };

  const unsubListener = (): void => {
    if (UNSUB_PROJECTS) {
      UNSUB_PROJECTS();
      UNSUB_PROJECTS = undefined;
    }
  };

  const clearProjects = (): void =>
    setprojectsData({
      active: [],
      archived: [],
    });
  return (
    <div className="app_flex_center flex-col">
      <ProjectsTable
        projectsData={projectsData}
        user={user}
      />
    </div>
  );
};

export default ProjectsDashboardPage;
