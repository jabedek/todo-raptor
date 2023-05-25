import React from "react";
import { useLoaderData } from "react-router-dom";

import { ProjectView } from "@@components/Projects";
import { Project } from "@@types";

const ProjectViewPage: React.FC = () => {
  const routeData = useLoaderData() as { projectData: Project | undefined; projectId: string };

  return (
    <div className="app_flex_center flex-col">
      <ProjectView
        projectData={routeData.projectData}
        projectId={routeData.projectId}
      />
    </div>
  );
};

export default ProjectViewPage;
