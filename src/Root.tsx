import Layout from "@@components/Layout/Layout";
import { AuthProvider } from "./context/AuthContext";
import { RoutingStateProvider } from "@@services/routing";
import { Outlet } from "react-router-dom";

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
