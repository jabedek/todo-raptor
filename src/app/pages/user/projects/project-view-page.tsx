import React from "react";
import { useLoaderData } from "react-router-dom";

import { ProjectView } from "@@components/Projects";
import { ProjectTypes } from "@@types";

const ProjectViewPage: React.FC = () => {
  const project = useLoaderData() as ProjectTypes.Project | undefined;

  return <ProjectView projectData={project} />;
};

export default ProjectViewPage;
