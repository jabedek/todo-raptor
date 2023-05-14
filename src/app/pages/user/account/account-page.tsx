import React from "react";

import { AccountInfo } from "@@components/Account";

const AccountPage: React.FC = () => {
  return (
    <div className="app_flex_center flex-col">
      <AccountInfo />
    </div>
  );
};

export default AccountPage;
