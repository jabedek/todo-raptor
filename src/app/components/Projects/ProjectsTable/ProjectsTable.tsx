import React, { useEffect, useState } from "react";

import "./ProjectsTable.scss";
import { Button } from "@@components/common";
import { usePopupContext } from "@@components/Layout";
import { NewProjectForm, ProjectsTableBody, ProjectsTableHeader } from "@@components/Projects";
import { ProjectTypes, UserTypes } from "@@types";
import { ProjectsAPI } from "@@api/firebase";
import SidePanel from "@@components/common/SidePanel";

export type ProjectsTableData = {
  active: ProjectTypes.Project[];
  archived: ProjectTypes.Project[];
};

interface ProjectTableProps {
  projectsData: ProjectsTableData | undefined;
  user: UserTypes.User | undefined;
}

const ProjectsTable: React.FC<ProjectTableProps> = ({ projectsData, user }) => {
  const [tab, settab] = useState<"active" | "archived">("active");
  const [activeCollection, setactiveCollection] = useState<ProjectTypes.Project[]>(projectsData?.active || []);
  const { showPopup, hidePopup, popupElement } = usePopupContext();

  const popupProject = () => {
    showPopup(<NewProjectForm />);
  };

  const deleteProject = async (projectId: string) => {
    ProjectsAPI.deleteProjectById(projectId).then(
      (r) => {
        hidePopup();
      },
      (err) => console.error(err)
    );
  };

  // console.log("ProjectsTable", popupProject, NewProjectForm);

  useEffect(() => {
    if (projectsData) {
      setactiveCollection(projectsData[tab]);
    }
  }, [projectsData, tab]);

  return (
    <>
      <div className="projects-table font-app_primary bg-[rgba(241,241,241,1)] flex ">
        {/* Main */}
        <div className="projects-table__main flex flex-col justify-between">
          <ProjectsTableHeader
            setTabFn={(tab) => settab(tab)}
            tab={tab}
          />

          <ProjectsTableBody
            projects={activeCollection}
            user={user}
            deleteProjectFn={deleteProject}
          />
        </div>

        {/* Side */}
        <SidePanel
          widthPx="220"
          heightPxHeader="50"
          heightPxBody="540">
          <div className="h-full  border-l-[1px]  project-border border app_flex_center">
            <Button
              label="New Project"
              clickFn={popupProject}
              formStyle="primary"
            />
          </div>
          <div className="h-full bg-white project-border border border-t-0  ">
            <div className="w-full h-full "></div>
          </div>
        </SidePanel>
      </div>
    </>
  );
};

export default ProjectsTable;
