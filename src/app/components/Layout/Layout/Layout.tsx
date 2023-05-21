import { useState } from "react";

import "./Layout.scss";
import { Header, Page, Sidebar } from "@@components/Layout";
import { RenderObject } from "@@components/common";
import { useUserValue } from "@@contexts";

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = (props) => {
  const [sidebarOpen, setsidebarOpen] = useState(false);
  const { user, firebaseAuthUser } = useUserValue();

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

      <RenderObject
        data={[firebaseAuthUser?.email, user?.authentication, user?.work]}
        tailwindStyles="absolute bottom-[0]"
      />
      <footer className="fixed bottom-1 right-3 rounded-md bg-gray-200 opacity-40 px-2 font-app_mono text-sm">
        {APP_VERSION}
      </footer>
    </div>
  );
};

export default Layout;
