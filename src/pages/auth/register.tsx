import Register from "@@components/Auth/Register";
import { Link } from "react-router-dom";

const RegisterPage: React.FC = () => {
  return (
    <div>
      <Link to="about">About Us</Link>
      <Register />
    </div>
  );
};

export default RegisterPage;
