import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";

const Logo: React.FC = () => (
  <div className="w-[40px] visible rounded-full">
    <Link to="/">
      <img
        className="logo logo-spin"
        src={logo}
      />
    </Link>
  </div>
);

export default Logo;
