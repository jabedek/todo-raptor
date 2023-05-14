import { ContactsProvider } from "@@contexts";
import { Suspense, lazy } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "src/app/router/components/ProtectedRoute";

const AccountPage = lazy(() => import("src/app/pages/user/account/account-page"));

export const USER_ROUTE_ACCOUNT: RouteObject = {
  path: "account",
  element: (
    <ContactsProvider>
      <Suspense fallback="Loading AccountPage">
        <ProtectedRoute>
          <AccountPage />
        </ProtectedRoute>
      </Suspense>
    </ContactsProvider>
  ),
};
