import { ProjectsAPI } from "@@api/firebase";
import { ProjectsTable } from "@@components/Projects";
import { useUserValue } from "@@contexts";
import { ProjectsFullData } from "@@types";
import { Unsubscribe } from "firebase/auth";
import { useState, useEffect } from "react";

let UNSUB_PROJECTS: Unsubscribe | undefined = undefined;

const ProjectsDashboardPage: React.FC = () => {
  const { user, canUseAPI } = useUserValue();

  const [projectsData, setprojectsData] = useState<ProjectsFullData>({ active: [], archived: [] });

  useEffect(() => {
    unsubListener();

    if (user && canUseAPI) {
      ProjectsAPI.listenProjectsWithAssigneesData([...user.work.projectsIds], false, (data: ProjectsFullData, unsubFn) => {
        UNSUB_PROJECTS = unsubFn;
        console.log(data);
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
