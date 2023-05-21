import React from "react";
import { useLoaderData } from "react-router-dom";

import { ProjectView } from "@@components/Projects";
import { Project } from "@@types";

const ProjectViewPage: React.FC = () => {
  const routeData = useLoaderData() as { projectData: Project | undefined; projectId: string };

  return (
    <ProjectView
      projectData={routeData.projectData}
      projectId={routeData.projectId}
    />
  );
};

export default ProjectViewPage;
