import { useEffect, useState } from "react";
import { Unsubscribe } from "firebase/auth";

import { ProjectsAPI, ListenersHandler } from "@@api/firebase";
import { ProjectsTable } from "@@components/Projects";
import { useUserValue, useApiAccessValue } from "@@contexts";
import { ProjectsSeparated } from "@@types";

enum ListenerDataName {
  project = "project",
}

const ProjectsDashboardPage: React.FC = () => {
  const Listeners = new ListenersHandler("ProjectsDashboardPage");
  const { user } = useUserValue();

  const { canAccessAPI } = useApiAccessValue();
  const [projectsData, setprojectsData] = useState<ProjectsSeparated>({ active: [], archived: [] });

  useEffect(() => {
    if (user && canAccessAPI) {
      ProjectsAPI.listenProjectsWithAssigneesData(
        [...user.work.projectsIds],
        false,
        (data: ProjectsSeparated | undefined, unsubFn: Unsubscribe | undefined) => {
          if (data && unsubFn) {
            Listeners.sub(ListenerDataName.project, unsubFn);
            setprojectsData(data);
          }
        }
      ).catch((e) => console.error(e));
    } else {
      clearProjects();
    }

    return () => Listeners.unsub(ListenerDataName.project);
  }, [user]);

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
