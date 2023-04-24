import Layout from "@@components/Layout/Layout";
import { AuthProvider } from "./context/AuthDataContext";
import { Outlet } from "react-router-dom";
import { PopupProvider } from "@@components/Layout/Popup/Popup";
import { UserDetailsProvider } from "@@context/UserDataContext";

function Root() {
  return (
    <>
      <AuthProvider>
        <UserDetailsProvider>
          <PopupProvider>
            <Layout>
              <Outlet />
            </Layout>
          </PopupProvider>
        </UserDetailsProvider>
      </AuthProvider>
    </>
  );
}

export default Root;
