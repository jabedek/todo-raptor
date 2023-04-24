import React from "react";
import { useLoaderData, useParams } from "react-router-dom";

const DashboardProject: React.FC = () => {
  const { paramId } = useParams();
  const item = useLoaderData();
  console.log(paramId, item);

  return <div>Dynamic Dashboard Page, Param</div>;
};

export default DashboardProject;
