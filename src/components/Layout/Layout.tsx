import { useState } from "react";
import Header from "./Header/Header";
import { Page } from "./Page";
import Sidebar from "./Sidebar";
import RenderObject from "@@components/common/RenderObject";
import { useAuthValue } from "@@context/AuthDataContext";
import { useUserDataValue } from "@@context/UserDataContext";

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = (props) => {
  const [sidebarOpen, setsidebarOpen] = useState(false);
  const { auth } = useAuthValue();
  const { userData, projectsData } = useUserDataValue();

  return (
    <div className="bg-gray-500 text-black h-screen w-screen ">
      <Header />
      <RenderObject
        data={auth}
        tailwindStyles="fixed bottom-[350px] right-0 bg-opacity-70 z-[100]"
      />
      <RenderObject
        data={userData}
        tailwindStyles="fixed bottom-[350px] right-[400px] bg-opacity-70 z-[100]"
      />
      <RenderObject
        data={projectsData}
        tailwindStyles="fixed bottom-[350px] right-[850px] bg-opacity-70 z-[100]"
      />

      <main className="app_header_top fixed w-screen overflow-x-hidden overflow-y-auto flex-col inset-0">
        <Sidebar
          isVisible={sidebarOpen}
          clickFn={setsidebarOpen}
        />
        <Page>{props.children}</Page>
      </main>
    </div>
  );
};

export default Layout;
