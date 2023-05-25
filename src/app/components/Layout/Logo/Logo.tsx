import { Link } from "react-router-dom";

import logo from "../../../../assets/images/logo.png";

const Logo: React.FC = () => (
  <Link to="/">
    <div className="w-[50px] h-[50px] flex  ">
      <img
        className="logo logo-spin"
        src={logo}
        height={50}
        width={50}
        alt="Todo-raptor logo"
        aria-label="Todo-raptor logo"
      />
    </div>
  </Link>
);

export default Logo;
