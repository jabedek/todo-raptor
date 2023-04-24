import { Link } from "react-router-dom";
import "./Header.scss";
import Logo from "../Logo";
import { AuthContext } from "@@context/AuthDataContext";
import { useContext } from "react";
import { CallbackFn } from "frotsi";

const HeaderNavLink: React.FC<{ path: string; name: string; clickFn?: CallbackFn }> = ({ path, name, clickFn }) => {
  if (clickFn) {
    return (
      <div
        className="header-nav-link cursor-pointer px-4 text-black transition-all  hover:text-app_primary duration-200"
        onClick={() => clickFn()}>
        {name}
      </div>
    );
  } else {
    return (
      <Link
        className="header-nav-link cursor-pointer px-4 text-black transition-all  hover:text-app_primary duration-200"
        to={path}>
        {name}
      </Link>
    );
  }
};

const Header = () => {
  const { auth, logout } = useContext(AuthContext);

  return (
    <header className="z-40 fixed app_header_height app_layout_padding flex content-center items-center justify-between w-full bg-white text-sm font-semibold font-app_primary px-8 py-2 shadow-md">
      <div className="app_flex_center">
        <Logo />
        <span className="px-3 text-[16px]">Task-o-saurus</span>
      </div>
      <span className="text-[13px]">{`${auth ? "Hi, " + auth.email + "!" : ""}`}</span>
      <nav className="w-auto app_flex_center">
        <HeaderNavLink
          path="/home"
          name="Home"
        />

        {!auth && (
          <>
            <HeaderNavLink
              path="/login"
              name="Login"
            />
            <HeaderNavLink
              path="/register"
              name="Register"
            />
          </>
        )}

        {auth && (
          <>
            <HeaderNavLink
              path="/projects-dashboard"
              name="Projects Dashboard"
            />
            <HeaderNavLink
              path="/account"
              name="Account"
            />
            <HeaderNavLink
              path=""
              name="Logout"
              clickFn={() => logout()}
            />
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
