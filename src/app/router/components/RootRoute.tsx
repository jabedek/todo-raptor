import { Outlet } from "react-router-dom";
import { Layout } from "@@components/Layout";
import { APIAccessProvider, UserProvider } from "src/app/contexts";
import { PopupProvider } from "@@components/Layout";

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
