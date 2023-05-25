import { lazy, Suspense } from "react";
import { Outlet, RouteObject } from "react-router-dom";

import { LoadingSpinner } from "@@components/common";
import { ProjectsAPI } from "src/app/api/firebase";
import ProtectedRoute from "src/app/router/components/ProtectedRoute";

const ProjectsDashboardPage = lazy(() => import("src/app/pages/user/projects/projects-dashboard-page"));
const ProjectViewPage = lazy(() => import("src/app/pages/user/projects/project-view-page"));

export const USER_ROUTE_PROJECTS: RouteObject = {
  path: "projects",

  element: (
    <ProtectedRoute path="projects">
      <Outlet />
    </ProtectedRoute>
  ),
  children: [
    {
      path: "",
      element: (
        <Suspense fallback={<LoadingSpinner size="xl" />}>
          <ProjectsDashboardPage />
        </Suspense>
      ),
    },

    {
      path: ":projectId",
      element: (
        <Suspense fallback={<LoadingSpinner size="xl" />}>
          <ProjectViewPage />
        </Suspense>
      ),
      loader: async ({ params }): Promise<unknown> => ({
        projectData: await ProjectsAPI.getProjectById(params.projectId || ""),
        projectId: params.projectId,
      }),
    },
  ],
};
