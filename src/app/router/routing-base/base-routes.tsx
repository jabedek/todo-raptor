import { lazy, Suspense } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import { LoadingSpinner } from "@@components/common";

const LoginPage = lazy(() => import("src/app/pages/base/auth/login-page"));
const RegisterPage = lazy(() => import("src/app/pages/base/auth/register-page"));
const WrongRoutePage = lazy(() => import("src/app/pages/base/wrong-route/wrong-route-page"));

export const BASE_ROUTES: RouteObject[] = [
  {
    path: "",
    element: (
      <Navigate
        to="projects"
        replace
      />
    ),
  },

  {
    path: "login",
    element: (
      <Suspense fallback={<LoadingSpinner size="xl" />}>
        <LoginPage />
      </Suspense>
    ),
  },

  {
    path: "register",
    element: (
      <Suspense fallback={<LoadingSpinner size="xl" />}>
        <RegisterPage />
      </Suspense>
    ),
  },

  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingSpinner size="xl" />}>
        <WrongRoutePage />
      </Suspense>
    ),
  },
];
