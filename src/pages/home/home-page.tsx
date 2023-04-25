import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <div>
      <Link to="auth/register">Register</Link>
      HomePage
    </div>
  );
};

export default HomePage;
