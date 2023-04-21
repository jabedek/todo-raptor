import NewProjectForm from "@@components/Projects/NewProjectForm";
import NewTaskForm from "@@components/Projects/NewTaskForm";
import ProjectList from "@@components/Projects/ProjectList";
import { useAuthValue } from "@@context/AuthContext";
import { usePopupContext } from "@@components/Layout/Popup/Popup";
import { ProjectsAPI } from "@@services/api/projectsAPI";
import { Project } from "@@types/Project";
import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";

const DashboardPage: React.FC = () => {
  const { user } = useAuthValue();
  const [projects, setprojects] = useState<Project[]>([]);

  const { showPopup } = usePopupContext();

  const popupTask = () => showPopup(<NewTaskForm />);
  const popupProject = () => showPopup(<NewProjectForm />);

  useEffect(() => {
    if (user) {
      const { projectsIdsCreated, projectsIdsManaged, projectsIdsWorking } = user.userData.projects;

      const projectsIdsCombined = new Set([...projectsIdsCreated, ...projectsIdsManaged, ...projectsIdsWorking]);
      console.log(user, [...projectsIdsCombined]);

      ProjectsAPI.getUserProjectsAllCombined(user.id, [...projectsIdsCombined]).then((projects) => {
        console.log("1", projects);

        if (projects) {
          setprojects(projects);
        }
      });
    }
  }, []);

  return (
    <div>
      <ProjectList projects={projects} />
      <div>DashboardPage</div>
      <button onClick={popupProject}>Add project</button>
      <button onClick={popupTask}>Add task</button>
      {/* <Link
        className="cursor-pointer px-4 text-black transition-all  hover:text-app_primary duration-200"
        to={"/project/123"}>
        project
      </Link> */}
      <Link
        className="cursor-pointer px-4 text-black transition-all  hover:text-app_primary duration-200"
        to={"/dashboard/123"}>
        project
      </Link>
      <Link
        className="cursor-pointer px-4 text-black transition-all  hover:text-app_primary duration-200"
        to={"/dashboard/analytics"}>
        DashboardAnalyticsPage
      </Link>
      <NewProjectForm />
      <NewTaskForm />
    </div>
  );
};

export default DashboardPage;
