import { ProjectsTable } from "@@components/Projects";
import { useProjectsValue, useUserValue } from "@@contexts";

const ProjectsDashboardPage: React.FC = () => {
  const { user } = useUserValue();
  const { projectsData } = useProjectsValue();

  return (
    <ProjectsTable
      projectsData={projectsData}
      user={user}
    />
  );
};

export default ProjectsDashboardPage;
