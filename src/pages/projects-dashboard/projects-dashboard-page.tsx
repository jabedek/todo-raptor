import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { usePopupContext } from "@@components/Layout";
import NewProjectForm from "@@components/Projects/NewProjectForm/NewProjectForm";
import ProjectsTable from "@@components/Projects/ProjectsTable/ProjectsTable";
import NewTaskForm from "@@components/Tasks/NewTaskForm/NewTaskForm";
import { useAuthDataValue, useUserDataValue } from "@@context";
import { ProjectsAPI } from "@@api";
import { ProjectTypes } from "@@types";

const ProjectsDashboardPage: React.FC = () => {
  const { auth } = useAuthDataValue();
  const { userData } = useUserDataValue();
  const [projects, setprojects] = useState<ProjectTypes.Project[]>([]);

  const { showPopup } = usePopupContext();

  const popupTask = () => showPopup(<NewTaskForm />);
  const popupProject = () => showPopup(<NewProjectForm />);

  useEffect(() => {
    if (auth && userData) {
      const { projectsIdsCreated, projectsIdsManaged, projectsIdsWorking } = userData.workDetails.projects;

      const projectsIdsCombined = new Set([...projectsIdsCreated, ...projectsIdsManaged, ...projectsIdsWorking]);
      console.log(auth, [...projectsIdsCombined]);

      ProjectsAPI.getUserProjectsAllCombined(auth.id, [...projectsIdsCombined]).then((projects) => {
        console.log("1", projects);

        if (projects) {
          setprojects(projects);
        }
      });
    }
  }, [userData?.workDetails.projects]);

  return (
    <div>
      <ProjectsTable projects={projects} />

      <div>
        <div>ProjectsDashboardPage</div>
        <button onClick={popupProject}>Add project</button>
        <button onClick={popupTask}>Add task</button>
        {/* <Link
        className="cursor-pointer px-4 text-black transition-all  hover:text-app_primary duration-200"
        to={"/project/123"}>
        project
      </Link> */}
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
