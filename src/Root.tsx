import Layout from "@@components/Layout/Layout";
import { AuthProvider } from "./context/AuthContext";
import { Outlet } from "react-router-dom";
import { RoutingStateProvider } from "@@context/RoutingStateContext";

function Root() {
  return (
    <>
      <AuthProvider>
        <RoutingStateProvider>
          <Layout>
            <Outlet />
          </Layout>
        </RoutingStateProvider>
      </AuthProvider>
    </>
  );
}

export default Root;
