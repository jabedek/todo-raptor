import { useState } from "react";

import "./Layout.scss";
import { useProjectsValue, useUserValue } from "@@contexts";
import RenderObject from "@@components/common/RenderObject/RenderObject";
import { Header, Page, Sidebar, usePopupContext } from "@@components/Layout";

type Props = {
  children: React.ReactNode;
};

const Layout: React.FC<Props> = (props) => {
  const [sidebarOpen, setsidebarOpen] = useState(false);
  const { user, firebaseAuthUser } = useUserValue();
  const { popupElement } = usePopupContext();
  return (
    <div className="bg-gray-500 text-black h-screen w-screen ">
      <Header />
      {/* <RenderObject
        data={auth}
        tailwindStyles="fixed bottom-[10%] right-0 bg-opacity-70 z-[100]"
      />
  
      <RenderObject
        data={projectsData}
        tailwindStyles="fixed bottom-[10%] right-[850px] bg-opacity-70 z-[100]"
      /> */}

      {/* <RenderObject
        data={userData}
        tailwindStyles="fixed bottom-[10%] right-[400px] bg-opacity-70 z-[100]"
      />
*/}
      {/* <RenderObject
        data={user}
        tailwindStyles="fixed bottom-[11%] right-[540px] bg-opacity-70 z-[100]"
      /> */}
      {/* 
      <RenderObject
        data={[firebaseAuthUser?.email]}
        tailwindStyles="fixed bottom-[11%] right-[40px] bg-opacity-70 z-[100]"
      /> */}

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
