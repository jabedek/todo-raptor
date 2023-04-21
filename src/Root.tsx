import Layout from "@@components/Layout/Layout";
import { AuthProvider } from "./context/AuthContext";
import { Outlet } from "react-router-dom";
import Popup from "@@components/Layout/Popup/Popup";
import { PopupProvider } from "@@components/Layout/Popup/Popup";

function Root() {
  return (
    <>
      <AuthProvider>
        <PopupProvider>
          <Layout>
            <Outlet />
          </Layout>
        </PopupProvider>
      </AuthProvider>
    </>
  );
}

export default Root;
