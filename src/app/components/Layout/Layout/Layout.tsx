import { useEffect, useState } from "react";

import "./Layout.scss";
import { useUserValue } from "@@contexts";
import { Header, Page, Sidebar, usePopupContext } from "@@components/Layout";
import AppCodeForm from "@@components/Account/AppCodeForm/AppCodeForm";

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = (props) => {
  const [sidebarOpen, setsidebarOpen] = useState(false);
  const { user, firebaseAuthUser, canUseAPI } = useUserValue();
  const { showPopup } = usePopupContext();

  const popupAppCodeForm = () => showPopup(<AppCodeForm />, true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (firebaseAuthUser && !canUseAPI) {
        popupAppCodeForm();
      }
    }, 3000);

    return () => {
      // clears timeout before running the new effect
      clearTimeout(timeout);
    };
  }, [firebaseAuthUser, canUseAPI]);

  return (
    <div className="bg-gray-500 text-black h-screen w-screen ">
      <Header />

      <main className="app_header_top fixed w-screen overflow-x-hidden overflow-y-auto flex-col inset-0">
        <Sidebar
          isVisible={sidebarOpen}
          clickFn={setsidebarOpen}
        />
        <Page>{props.children}</Page>
      </main>

      <footer className="fixed bottom-1 right-3 rounded-md bg-gray-200 opacity-40 px-2 font-app_mono text-sm">
        {APP_VERSION}
      </footer>
    </div>
  );
};

export default Layout;
