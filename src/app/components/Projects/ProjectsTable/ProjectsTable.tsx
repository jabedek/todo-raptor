import React, { useEffect, useState } from "react";

import "./ProjectsTable.scss";
import { Project, FullProjectAssignee, ProjectWithAssigneesRegistry, User } from "@@types";
import { ProjectsAPI } from "@@api/firebase";
import { Button } from "@@components/common";
import { usePopupContext } from "@@components/Layout";
import { ProjectForm, ProjectsTableBody, ProjectsTableHeader } from "@@components/Projects";
import SidePanel from "@@components/common/SidePanel";
import { ProjectsFullData } from "@@types";

interface Props {
  projectsData: ProjectsFullData | undefined;
  user: User | undefined;
}

const ProjectsTable: React.FC<Props> = ({ projectsData, user }) => {
  const [tab, settab] = useState<"active" | "archived">("active");
  const [activeCollection, setactiveCollection] = useState<ProjectWithAssigneesRegistry[]>([]);
  const { showPopup, hidePopup } = usePopupContext();

  const popupProject = () => {
    showPopup(<ProjectForm />);
  };

  useEffect(() => {
    if (projectsData) {
      console.log(projectsData);

      setactiveCollection(projectsData[tab]);
    }
  }, [projectsData, tab]);

  return (
    <>
      <div className="projects-table-wrapper flex flex-col rounded-[14px] overflow-hidden">
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
            />
          </div>

          {/* Side */}
          <SidePanel for="projects-table">
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
      </div>
    </>
  );
};

export default ProjectsTable;
