import { LoadingSpinner } from "@@components/common";
import { ContactsProvider } from "@@contexts";
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";
import ProtectedRoute from "src/app/router/components/ProtectedRoute";

const AccountPage = lazy(() => import("src/app/pages/user/account/account-page"));

export const USER_ROUTE_ACCOUNT: RouteObject = {
  path: "account",
  element: (
    <ContactsProvider>
      <Suspense fallback={<LoadingSpinner size="xl" />}>
        <ProtectedRoute path="account">
          <AccountPage />
        </ProtectedRoute>
      </Suspense>
    </ContactsProvider>
  ),
};
