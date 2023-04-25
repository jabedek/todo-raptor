import Home from "src/pages/home/home-page";
import RegisterPage from "src/pages/auth/register-page";
import Dashboard from "src/pages/projects-dashboard/projects-dashboard-page";
import DashboardAnalyticsPage from "src/pages/projects-dashboard/analytics-page";
import Landing from "src/pages/landing/landing-page";
import LoginPage from "src/pages/auth/login-page";
import AccountPage from "src/pages/account/account-page";
import WrongRoutePage from "src/pages/wrong-route/[wrong-route-page]";
import DashboardProject from "src/pages/projects-dashboard/$projectId";
import ProjectViewPage from "src/pages/project-view/project-view-page";

const PAGES = {
  Home,
  RegisterPage,
  Dashboard,
  DashboardAnalyticsPage,
  Landing,
  LoginPage,
  AccountPage,
  WrongRoutePage,
  DashboardProject,
  ProjectViewPage,
};

export { PAGES };
