import { Suspense, lazy } from "react";
import { Navigate, RouteObject } from "react-router-dom";

import HomePage from "src/app/pages/base/home/home-page";

const LoginPage = lazy(() => import("src/app/pages/base/auth/login-page"));
const RegisterPage = lazy(() => import("src/app/pages/base/auth/register-page"));
const WrongRoutePage = lazy(() => import("src/app/pages/base/wrong-route/wrong-route-page"));

export const BASE_ROUTES: RouteObject[] = [
  {
    path: "",
    element: (
      <Navigate
        to="home"
        replace
      />
    ),
  },

  {
    path: "home",
    element: <HomePage />,
  },

  {
    path: "login",
    element: (
      <Suspense fallback="Loading LoginPage">
        <LoginPage />
      </Suspense>
    ),
  },

  {
    path: "register",
    element: (
      <Suspense fallback="Loading RegisterPage">
        <RegisterPage />
      </Suspense>
    ),
  },

  {
    path: "*",
    element: (
      <Suspense fallback="Loading WrongRoutePage">
        <WrongRoutePage />
      </Suspense>
    ),
  },
];
