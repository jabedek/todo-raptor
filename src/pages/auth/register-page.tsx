import Register from "@@components/Auth/Register";
import { Link } from "react-router-dom";

const RegisterPage: React.FC = () => {
  return (
    <div className="app_flex_center relative top-[300px]">
      <Register />
    </div>
  );
};

export default RegisterPage;
