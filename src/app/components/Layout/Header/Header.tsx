import { CallbackFn } from "frotsi";
import { Link } from "react-router-dom";

import { Logo } from "@@components/Layout";
import { useUserValue } from "@@contexts";
import { useEffect, useState } from "react";

type Props = { path: string; name: string; clickFn?: CallbackFn };

const HeaderNavLink: React.FC<Props> = ({ path, name, clickFn }) => {
  if (clickFn) {
    return (
      <div
        className="header-nav-link font-app_primary cursor-pointer text-black transition-all  hover:text-app_primary duration-200"
        onClick={() => clickFn()}>
        {name}
      </div>
    );
  } else {
    return (
      <Link
        className="header-nav-link font-app_primary cursor-pointer text-black transition-all  hover:text-app_primary duration-200"
        to={path}>
        {name}
      </Link>
    );
  }
};

const Header: React.FC = () => {
  const { firebaseAuthUser, user, logout } = useUserValue();
  const [isAuth, setisAuth] = useState(false);

  useEffect(() => {
    setisAuth(!!(firebaseAuthUser && user));
  }, [firebaseAuthUser, user]);

  return (
    <header className="z-40 fixed app_header_height app_layout_padding flex content-center items-center justify-between w-full bg-white text-sm font-semibold font-app_primary px-8 py-2 shadow-md">
      <div className="app_flex_center">
        <Logo />
        <span className="px-3 text-[16px]">Todo-raptor</span>
      </div>
      <span className="text-[13px]">{`${isAuth && user ? "Hi, " + user.authentication?.email + "!" : ""}`}</span>
      <nav className="w-[420px] flex justify-end gap-[38px]">
        {!isAuth && (
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

        {isAuth && (
          <>
            <HeaderNavLink
              path="/projects"
              name="Projects"
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
