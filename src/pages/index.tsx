import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div>
      <Link to="auth/register">Register</Link>
      Home
    </div>
  );
};

export default Home;
