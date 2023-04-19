import LoginForm from "@@components/Auth/LoginForm";
import React from "react";

const LoginPage: React.FC = () => {
  return (
    <div className="app_flex_center relative top-[300px]">
      <LoginForm />
    </div>
  );
};
export default LoginPage;
