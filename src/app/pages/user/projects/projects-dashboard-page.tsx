import { ProjectsAPI } from "@@api/firebase";
import { ProjectsTable } from "@@components/Projects";
import { useUserValue } from "@@contexts";
import { ProjectsFullData } from "@@types";
import { Unsubscribe } from "firebase/auth";
import { useEffect, useState } from "react";
import { useApiAccessValue } from "src/app/contexts/ApiAccessContext";

let UNSUB_PROJECTS: Unsubscribe | undefined = undefined;

const ProjectsDashboardPage: React.FC = () => {
  const { user } = useUserValue();

  const { canAccessAPI } = useApiAccessValue();
  const [projectsData, setprojectsData] = useState<ProjectsFullData>({ active: [], archived: [] });

  useEffect(() => {
    unsubListener();
    if (user && canAccessAPI) {
      ProjectsAPI.listenProjectsWithAssigneesData(
        [...user.work.projectsIds],
        false,
        (data: ProjectsFullData | undefined, unsubFn: Unsubscribe | undefined) => {
          if (data && unsubFn) {
            UNSUB_PROJECTS = unsubFn;
            setprojectsData(data);
          }
        }
      ).catch((e) => console.error(e));
    } else {
      clearProjects();
    }

    return () => unsubListener();
  }, [user]);

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
