import { Outlet } from "react-router-dom";
import { Layout } from "@@components/Layout";
import { UserProvider } from "src/app/contexts";
import { PopupProvider } from "@@components/Layout";
import { ReactIcons } from "@@components/Layout/preloaded-icons";

function RootRoute() {
  return (
    <UserProvider>
      <PopupProvider>
        <Layout>
          <Outlet />
        </Layout>
      </PopupProvider>
    </UserProvider>
  );
}

export default RootRoute;
