import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import NewProjectForm from "@@components/Projects/NewProjectForm/NewProjectForm";
import ProjectsTable from "@@components/Projects/ProjectsTable/ProjectsTable";
import NewTaskForm from "@@components/Tasks/NewTaskForm/NewTaskForm";
import { usePopupContext } from "@@components/Layout";
import { ProjectsAPI } from "@@api/firebase";
import { ProjectTypes } from "@@types";
import { useProjectsValue, useUserValue } from "@@contexts";

const ProjectsDashboardPage: React.FC = () => {
  const { user } = useUserValue();
  // const [projects, setprojects] = useState<ProjectTypes.ProjectsTableData>(PROJECTS_TABLE_DATA_INITIAL);
  const { projectsData } = useProjectsValue();
  const { showPopup } = usePopupContext();
  const popupTask = () => showPopup(<NewTaskForm />);

  // useEffect(() => {
  //   if (user) {
  //     ProjectsAPI.getUserProjects(user).then((projects) => {
  //       if (projects) {
  //         setprojects(projects);
  //       }
  //     });
  //   }
  // }, [user?.work.projects]);

  return (
    <div>
      <ProjectsTable
        projectsData={projectsData}
        user={user}
      />

      <div>
        <div>ProjectsDashboardPage</div>
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
        <NewProjectForm />
        <NewTaskForm />
      </div>
    </div>
  );
};

export default ProjectsDashboardPage;
