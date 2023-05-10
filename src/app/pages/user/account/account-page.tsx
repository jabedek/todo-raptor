import React from "react";
import { useNavigate } from "react-router-dom";

import AccountInfo from "@@components/Auth/AccountInfo/AccountInfo";

const AccountPage: React.FC = () => {
  const navigate = useNavigate();

  const test = () => {
    navigate("/projects-dashboard/123", { relative: "route" });
  };

  return (
    <div className="app_flex_center flex-col">
      <AccountInfo />
      <button onClick={test}>Test</button>
    </div>
  );
};

export default AccountPage;
