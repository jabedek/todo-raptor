import { Outlet } from "react-router-dom";

import { APIAccessProvider, UserProvider } from "@@contexts";
import { Layout, PopupProvider } from "@@components/Layout";

export function RootRoute(): JSX.Element {
  return (
    <UserProvider>
      <PopupProvider>
        <APIAccessProvider>
          <Layout>
            <Outlet />
          </Layout>
        </APIAccessProvider>
      </PopupProvider>
    </UserProvider>
  );
}
