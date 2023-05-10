import { ProjectsProvider } from "@@contexts";
import { Suspense, lazy } from "react";
import { Outlet, RouteObject } from "react-router-dom";
import { ProjectsAPI } from "src/app/api/firebase";
import ProtectedRoute from "src/app/router/components/ProtectedRoute";

const ProjectsDashboardPage = lazy(() => import("src/app/pages/user/projects/projects-dashboard-page"));
const ProjectViewPage = lazy(() => import("src/app/pages/user/projects/project-view-page"));

export const USER_ROUTE_PROJECTS: RouteObject = {
  path: "projects",
  element: (
    <ProjectsProvider>
      <ProtectedRoute>
        <Outlet />
      </ProtectedRoute>
    </ProjectsProvider>
  ),
  children: [
    {
      path: "",
      element: (
        <Suspense fallback="Loading ProjectsDashboardPage">
          <ProjectsDashboardPage />
        </Suspense>
      ),
    },

    {
      path: ":projectId",
      element: (
        <Suspense fallback="Loading ProjectViewPage">
          <ProjectViewPage />
        </Suspense>
      ),
      loader: async ({ params }) => {
        const id = `${params.projectId}`;
        return { projectId: id, data: await ProjectsAPI.getProjectById(id) };
      },
    },
  ],
};
