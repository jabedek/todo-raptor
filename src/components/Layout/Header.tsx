import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { AuthContext } from "@@context/AuthContext";
import { useContext } from "react";
import { CallbackFn } from "frotsi";

import { User as FirebaseUser, signOut } from "firebase/auth";
import { firebaseAuth, firebaseDB } from "@@services/firebase/firebase-config";

const HeaderNavLink: React.FC<{ path: string; name: string; action?: CallbackFn }> = ({ path, name, action }) => {
  if (action) {
    return (
      <div
        className="cursor-pointer px-4 text-black transition-all  hover:text-app_primary duration-200"
        onClick={() => action()}>
        {name}
      </div>
    );
  } else {
    return (
      <Link
        className="cursor-pointer px-4 text-black transition-all  hover:text-app_primary duration-200"
        to={path}>
        {name}
      </Link>
    );
  }
};
const Header = () => {
  const { user, clearAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = () => {
    signOut(firebaseAuth).then(
      () => {
        clearAuth();
        navigate("/");
      },
      (error: Error) => {
        console.error("Something went wrong while signing out:");
        console.error(error);
      }
    );
  };

  return (
    <header className="z-40 fixed app_header_height app_layout_padding flex content-center items-center justify-between w-full bg-white text-sm font-semibold font-app_primary px-8 py-2">
      <div className="app_flex_center">
        <Logo />
        <span className="px-3 text-[17px]">Task-o-saurus</span>
      </div>
      <nav className="w-auto app_flex_center">
        <HeaderNavLink
          path="/home"
          name="Home"
        />

        {!user && (
          <HeaderNavLink
            path="/login"
            name="Login"
          />
        )}

        {!user && (
          <HeaderNavLink
            path="/register"
            name="Register"
          />
        )}

        {user && (
          <HeaderNavLink
            path="/account"
            name="Account"
          />
        )}

        {user && (
          <HeaderNavLink
            path=""
            name="Logout"
            action={() => logout()}
          />
        )}
      </nav>
    </header>
  );
};

export default Header;
