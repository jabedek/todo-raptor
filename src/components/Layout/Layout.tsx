import { useState } from "react";
import Header from "./Header";
import { Page } from "./Page";
import Sidebar from "./Sidebar";

type Props = {
  children: React.ReactNode;
};

const Layout = (props: Props) => {
  const [sidebarOpen, setsidebarOpen] = useState(false);

  return (
    <div className="bg-gray-500 text-black h-screen w-screen">
      <Header />

      <main className="app_header_top fixed w-screen overflow-x-hidden overflow-y-auto flex-col inset-0">
        <Sidebar
          isOpened={sidebarOpen}
          setState={setsidebarOpen}
        />
        <Page>{props.children}</Page>
      </main>
    </div>
  );
};

export default Layout;
