import React from "react";
import { useLoaderData, useParams } from "react-router-dom";

const ProjectViewPage: React.FC = () => {
  const { projectId } = useParams();
  const item = useLoaderData();
  console.log(projectId, item);

  return <div>Dynamic Dashboard Page, Param</div>;
};

export default ProjectViewPage;
