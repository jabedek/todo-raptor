import { simpleRoutes } from "@@services/routing";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const Header = () => (
  <header className="z-40 fixed app_header_height app_layout_padding flex content-center items-center justify-between w-full bg-white text-sm font-semibold font-app_primary px-8 py-2">
    <div className="app_flex_center">
      <Logo />
      <span className="px-3 text-[17px]">Task-o-saurus</span>
    </div>
    <nav>
      {simpleRoutes.map(({ path, name }, index) => {
        return (
          <Link
            className="px-4 text-black transition-all  hover:text-app_primary duration-200"
            key={`${index}-${name}`}
            to={path}>
            {name}
          </Link>
        );
      })}
    </nav>
  </header>
);

export default Header;
