import { Link } from "react-router-dom";

import logo from "../../../../assets/images/logo.png";

const Logo: React.FC = () => (
  <Link to="/">
    <div className="w-[40px] h-[40px] visible rounded-full">
      <img
        className="logo logo-spin"
        src={logo}
        width={40}
      />
    </div>
  </Link>
);

export default Logo;
