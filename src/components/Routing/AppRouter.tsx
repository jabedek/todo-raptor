import { createBrowserRouter, Outlet, RouteObject } from "react-router-dom";

import ProtectedRoute from "@@components/Routing/ProtectedRoute";
import { ProjectsAPI } from "@@api";
import Root from "src/Root";
import { PAGES } from "src/pages";

export type AppRouteParams = {
  paramId: string | number;
  data?: any;
};

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Root />,

    children: [
      { path: "", element: <PAGES.Landing /> },
      {
        path: "home",
        element: <PAGES.Home />,
      },
      {
        path: "project/:paramId",
        loader: async ({ params }): Promise<AppRouteParams> => {
          console.log("3", params.paramId);

          const id = `${params.paramId}`;
          const data = await ProjectsAPI.getProjectById(id);

          return { paramId: id, data }; // fetch(`/api/teams/${params.projectId}.json`);
        },

        element: (
          <ProtectedRoute>
            <PAGES.ProjectViewPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "projects-dashboard",
        element: (
          <ProtectedRoute>
            <PAGES.Dashboard />
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "analytics",
            element: <PAGES.DashboardAnalyticsPage />,
          },
          {
            path: ":projectId",
            loader: async ({ params }): Promise<AppRouteParams> => {
              console.log(params.paramId);

              return { paramId: 123 }; // fetch(`/api/teams/${params.projectId}.json`);
            },

            element: (
              <PAGES.DashboardProject />
              // <ProtectedRoute>
              // </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "account",
        element: (
          <ProtectedRoute>
            <PAGES.AccountPage />
          </ProtectedRoute>
        ),
        // loader: teamLoader,
      },
      {
        path: "login",
        element: <PAGES.LoginPage />,
        // loader: teamLoader,
      },
      {
        path: "register",
        element: <PAGES.RegisterPage />,
        // loader: teamLoader,
      },
      { path: "*", element: <PAGES.WrongRoutePage /> },
    ],
  },
];

const AppRouter = createBrowserRouter(routes, { basename: "" });

export { AppRouter };
