import { useState } from "react";

import "./Layout.scss";
import { Header, Page, Sidebar } from "@@components/Layout";

type Props = {
  children: React.ReactNode;
};

const PACKAGE_VERSION = import.meta.env.PACKAGE_VERSION;

const Layout: React.FC<Props> = (props) => {
  const [sidebarOpen, setsidebarOpen] = useState(false);

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
        {PACKAGE_VERSION}
      </footer>
    </div>
  );
};

export default Layout;
