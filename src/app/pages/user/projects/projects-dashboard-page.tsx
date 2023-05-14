import { Link } from "react-router-dom";

import { NewProjectForm, ProjectsTable } from "@@components/Projects";
import NewTaskForm from "@@components/Tasks/NewTaskForm/NewTaskForm";
import { usePopupContext } from "@@components/Layout";

import { useProjectsValue, useUserValue } from "@@contexts";

const ProjectsDashboardPage: React.FC = () => {
  const { user } = useUserValue();
  const { projectsData } = useProjectsValue();
  const { showPopup } = usePopupContext();
  const popupTask = () => showPopup(<NewTaskForm />);

  return (
    <div>
      <ProjectsTable
        projectsData={projectsData}
        user={user}
      />

      <div>
        <button onClick={popupTask}>Add task</button>
        <Link
          className="cursor-pointer px-4 text-black transition-all  hover:text-app_primary duration-200"
          to={"/projects-dashboard/123"}>
          project
        </Link>
        <Link
          className="cursor-pointer px-4 text-black transition-all  hover:text-app_primary duration-200"
          to={"/projects-dashboard/analytics"}>
          DashboardAnalyticsPage
        </Link>
      </div>
    </div>
  );
};

export default ProjectsDashboardPage;
