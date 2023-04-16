import React from "react";
import { useParams } from "react-router-dom";

const DynamicDashboard: React.FC = () => {
  const { id } = useParams();

  return <div>Dynamic Dashboard Page, Param: {id}</div>;
};

export default DynamicDashboard;
