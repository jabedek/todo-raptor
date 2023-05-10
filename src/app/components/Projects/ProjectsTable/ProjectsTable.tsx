import React, { useEffect, useState } from "react";

import "./ProjectsTable.scss";
import { FormButton } from "@@components/forms";
import { usePopupContext } from "@@components/Layout";
import { ProjectTypes, UserTypes } from "@@types";
import ProjectTableItem from "./ProjectTableItem/ProjectTableItem";
import ProjectBadge from "./ProjectBadge/ProjectBadge";
import NewProjectForm from "../NewProjectForm/NewProjectForm";
import { ProjectsAPI } from "@@api/firebase";

interface ProjectTableProps {
  projectsData: ProjectTypes.ProjectsTableData | undefined;
  user: UserTypes.User | undefined;
}

const ProjectsTable: React.FC<ProjectTableProps> = ({ projectsData, user }) => {
  const [tab, settab] = useState<"manage" | "work" | "archived">("manage");
  const [activeCollection, setactiveCollection] = useState<ProjectTypes.Project[]>(projectsData?.activeManaged || []);
  const { showPopup, hidePopup } = usePopupContext();

  useEffect(() => {
    if (projectsData) {
      switch (tab) {
        case "work":
          setactiveCollection(projectsData?.activeWorking);
          break;
        case "manage":
          setactiveCollection(projectsData?.activeManaged);
          break;
        case "archived":
          setactiveCollection([...projectsData?.archivedWorking, ...projectsData?.archivedManaged]);
          break;
      }
    }
  }, [projectsData, tab]);

  const popupProject = () => showPopup(<NewProjectForm />);
  // const tags = [...new Set(projects.flatMap((project) => project.tags))];
  // const statuses = [...new Set(projects.map((project) => project.status))];

  // const handleTagChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedTags(Array.from(event.target.selectedOptions, (option) => option.value));
  // };

  // const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   setSelectedStatus(event.target.value);
  // };

  const deleteProject = async (projectId: string) => {
    ProjectsAPI.deleteProjectById(projectId).then(
      (r) => {
        console.log("git", r);
        hidePopup();
      },
      (err) => console.error(err)
    );
  };

  return (
    <>
      <div className="projects-table font-app_primary bg-[rgba(241,241,241,1)] flex   ">
        <div className="projects-table__main flex flex-col justify-between">
          <div className="table-header bg-white text-[14px] project-border border border-r-0">
            <div
              className={`header-tab-wrapper ${tab === "manage" && "selected"}`}
              onClick={() => settab("manage")}>
              <ProjectBadge
                variant="manage"
                label="Projects you manage"
              />
            </div>

            <div
              className={`header-tab-wrapper ${tab === "work" && "selected"}`}
              onClick={() => settab("work")}>
              <ProjectBadge
                variant="work"
                label="Projects you are managed in"
              />
            </div>

            <div
              className={`header-tab-wrapper ${tab === "archived" && "selected"}`}
              onClick={() => settab("archived")}>
              <ProjectBadge
                variant="archived"
                label="Archived Projects"
              />
            </div>
          </div>

          <div className="table-body  ">
            {activeCollection.map((project, i) => (
              <ProjectTableItem
                project={project}
                user={user}
                deleteFn={() => deleteProject(project.id)}
                key={i}
              />
            ))}
          </div>
        </div>

        <div className="projects-table__side flex flex-col bg-white  justify-between">
          <div className="table-filter-top project-border border-l-[1px]  project-border border app_flex_center">
            <FormButton
              label="New Project"
              clickFn={popupProject}
              style="primary"
            />
          </div>
          <div className="table-filter-bottom bg-white project-border border border-t-0  ">
            <div className="w-full h-full "></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectsTable;
