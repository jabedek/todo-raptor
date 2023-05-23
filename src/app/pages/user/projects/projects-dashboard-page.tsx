import { ProjectsAPI } from "@@api/firebase";
import { ProjectsTable } from "@@components/Projects";
import { useUserValue } from "@@contexts";
import { ProjectsFullData } from "@@types";
import { Unsubscribe } from "firebase/auth";
import { useState, useEffect } from "react";
import { useApiAccessValue } from "src/app/contexts/ApiAccessContext";

let UNSUB_PROJECTS: Unsubscribe | undefined = undefined;

const ProjectsDashboardPage: React.FC = () => {
  const { user } = useUserValue();

  const { canAccessAPI } = useApiAccessValue();
  const [projectsData, setprojectsData] = useState<ProjectsFullData>({ active: [], archived: [] });

  useEffect(() => {
    unsubListener();

    if (user && canAccessAPI) {
      ProjectsAPI.listenProjectsWithAssigneesData([...user.work.projectsIds], false, (data: ProjectsFullData, unsubFn) => {
        UNSUB_PROJECTS = unsubFn;
        setprojectsData(data);
      });
    } else {
      clearProjects();
    }

    return () => unsubListener();
  }, [user]);

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
    <ProjectsTable
      projectsData={projectsData}
      user={user}
    />
  );
};

export default ProjectsDashboardPage;
