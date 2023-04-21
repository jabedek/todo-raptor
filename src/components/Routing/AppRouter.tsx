import { createBrowserRouter, Outlet, RouteObject } from "react-router-dom";
import Root from "src/Root";
import Home from "src/pages/home-page";
import RegisterPage from "src/pages/auth/register-page";
import Dashboard from "src/pages/dashboard/dashboard-page";
import DashboardAnalyticsPage from "src/pages/dashboard/analytics-page";
import Landing from "src/pages/landing-page";
import LoginPage from "src/pages/auth/login-page";
import AccountPage from "src/pages/account/account-page";
import WrongRoutePage from "src/pages/[wrong-route-page]";
import ProtectedRoute from "@@components/Routing/ProtectedRoute";
import ProjectPanel from "@@components/Projects/ProjectPanel";
import DashboardProject from "src/pages/dashboard/$projectId";
import ProjectView from "@@components/Projects/ProjectView";
import { ProjectsAPI } from "@@services/api/projectsAPI";

export type AppRouteParams = {
  paramId: string | number;
  data?: any;
};

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Root />,

    children: [
      { path: "", element: <Landing /> },
      {
        path: "home",
        element: <Home />,
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
            <ProjectView />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "analytics",
            element: <DashboardAnalyticsPage />,
          },
          {
            path: ":projectId",
            loader: async ({ params }): Promise<AppRouteParams> => {
              console.log(params.paramId);

              return { paramId: 123 }; // fetch(`/api/teams/${params.projectId}.json`);
            },

            element: (
              <DashboardProject />
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
            <AccountPage />
          </ProtectedRoute>
        ),
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
      { path: "*", element: <WrongRoutePage /> },
    ],
  },
];

const AppRouter = createBrowserRouter(routes, { basename: "" });

export { AppRouter };
