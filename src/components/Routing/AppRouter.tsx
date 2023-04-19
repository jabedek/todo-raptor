import { createBrowserRouter, RouteObject } from "react-router-dom";
import Root from "src/Root";
import Home from "src/pages/home-page";
import RegisterPage from "src/pages/auth/register-page";
import Dashboard from "src/pages/dashboard/dashboard-page";
import Landing from "src/pages/landing-page";
import LoginPage from "src/pages/auth/login-page";
import AccountPage from "src/pages/account/account-page";
import WrongRoutePage from "src/pages/[wrong-route-page]";
import ProtectedRoute from "@@components/Routing/ProtectedRoute";
import ProjectPanel from "@@components/Projects/ProjectPanel";

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
        path: "dashboard/:projectId",
        loader: async ({ params }) => {
          console.log(params.projectId);

          return { a: 123 }; // fetch(`/api/teams/${params.projectId}.json`);
        },
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
        // children: [
        //   {
        //     // element: (
        //     //   <ProtectedRoute>
        //     //     <ProjectPanel />
        //     //   </ProtectedRoute>
        //     // ),
        //     path: ":projectId",
        //     loader: async ({ params }) => {
        //       return params.projectId; // fetch(`/api/teams/${params.projectId}.json`);
        //     },
        //   },
        // ],
        // loader: teamLoader,
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
