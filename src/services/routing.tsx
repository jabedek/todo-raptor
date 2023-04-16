import { RoutingState } from "@@types/common";
import { createContext, useEffect, useState } from "react";
import { Link, createBrowserRouter, RouteObject, useLocation, useNavigation } from "react-router-dom";
import Root from "src/Root";
import Home from "src/pages/home-page";
import RegisterPage from "src/pages/auth/register-page";
import Dashboard from "src/pages/dashboard/dashboard-page";
import WrongRoute from "src/pages/[wrong-route-page]";
import Account from "src/pages/account/account-page";
import Analytics from "src/pages/dashboard/analytics-page";
import Landing from "src/pages/landing-page";
import LoginPage from "src/pages/auth/login-page";
import AccountPage from "src/pages/account/account-page";

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
        path: "login",
        element: <LoginPage />,
        // loader: teamLoader,
      },
      {
        path: "register",
        element: <RegisterPage />,
        // loader: teamLoader,
      },
      {
        path: "account",
        element: <AccountPage />,
        // loader: teamLoader,
      },
    ],
  },
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

export { AppRouter, RoutingStateContext, RoutingStateProvider };
