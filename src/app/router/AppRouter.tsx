import { createBrowserRouter, RouteObject } from "react-router-dom";

import { BASE_ROUTES } from "src/app/router/routing-base/base-routes";
import { USER_ROUTES } from "src/app/router/routing-user/user-routes";
import RootRoute from "./components/RootRoute";

const APP_ROUTES: RouteObject[] = [
  {
    path: "/",
    element: <RootRoute />,
    children: [...BASE_ROUTES, ...USER_ROUTES],
  },
];

const AppRouter = createBrowserRouter(APP_ROUTES, { basename: "" });

export { AppRouter };
