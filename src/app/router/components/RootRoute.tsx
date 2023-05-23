import { Outlet } from "react-router-dom";
import { Layout } from "@@components/Layout";
import { APIAccessProvider, UserProvider } from "src/app/contexts";
import { PopupProvider } from "@@components/Layout";

function RootRoute() {
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

export default RootRoute;
