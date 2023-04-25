import { Outlet } from "react-router-dom";
import { Layout, PopupProvider } from "@@components/Layout";
import { UserDetailsProvider, AuthDataProvider } from "@@context";

function Root() {
  return (
    <>
      <AuthDataProvider>
        <UserDetailsProvider>
          <PopupProvider>
            <Layout>
              <Outlet />
            </Layout>
          </PopupProvider>
        </UserDetailsProvider>
      </AuthDataProvider>
    </>
  );
}

export default Root;
