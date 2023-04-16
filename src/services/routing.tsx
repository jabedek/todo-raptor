import { RoutingState } from "@@types/common";
import { createContext, useEffect, useState } from "react";
import { Link, createBrowserRouter, RouteObject, useLocation, useNavigation } from "react-router-dom";
import Root from "src/Root";
import Home from "src/pages";
import RegisterPage from "src/pages/auth/register";
import Dashboard from "src/pages/dashboard";
import WrongRoute from "src/pages/[wrong-route]";
import Account from "src/pages/account";
import Analytics from "src/pages/dashboard/analytics";
import Landing from "src/pages/landing";

type SimpleRoute = {
  path: string;
  name: string;
  forAuth?: boolean;
  forAdmin?: boolean;
};

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Root />,
    // loader: rootLoader,
    children: [
      { path: "", element: <Landing /> },
      {
        path: "home",
        element: <Home />,
        // loader: teamLoader,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
        // loader: teamLoader,
      },
      {
        path: "register",
        element: <RegisterPage />,
        // loader: teamLoader,
      },
    ],
  },
];

const simpleRoutes: SimpleRoute[] = [
  { path: "/home", name: "Home" },
  { path: "/dashboard", name: "Dashboard" },
  { path: "/register", name: "Register" },
];

const AppRouter = createBrowserRouter(routes, { basename: "" });

const RoutingStateContext = createContext<RoutingState>({ location: "", state: "idle" });

const RoutingStateProvider = ({ children }: any) => {
  const [routingState, setroutingState] = useState<RoutingState>({ location: "", state: "idle" });
  const navigation = useNavigation();
  const location = useLocation();

  useEffect(() => {
    setroutingState({ state: navigation.state, location: location.pathname });
  }, [navigation.state, location.pathname]);

  return (
    <>
      <RoutingStateContext.Provider value={{ location: routingState?.location, state: routingState?.state }}>
        {children}
      </RoutingStateContext.Provider>
    </>
  );
};

export { simpleRoutes, AppRouter, RoutingStateContext, RoutingStateProvider };
