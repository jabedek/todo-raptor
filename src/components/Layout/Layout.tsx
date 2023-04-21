import { useState } from "react";
import Header from "./Header";
import { Page } from "./Page";
import Sidebar from "./Sidebar";
import RenderObject from "@@components/common/RenderObject";
import { useAuthValue } from "@@context/AuthContext";

type Props = {
  children: React.ReactNode;
};

const Layout = (props: Props) => {
  const { user } = useAuthValue();
  const [sidebarOpen, setsidebarOpen] = useState(false);

  return (
    <div className="bg-gray-500 text-black h-screen w-screen">
      <Header />
      <RenderObject
        data={user}
        tailwindStyles="fixed top-[350px] bg-opacity-70 z-[100]"
      />

      <main className="app_header_top fixed w-screen overflow-x-hidden overflow-y-auto flex-col inset-0">
        <Sidebar
          isVisible={sidebarOpen}
          setState={setsidebarOpen}
        />
        <Page>{props.children}</Page>
      </main>
    </div>
  );
};

export default Layout;
