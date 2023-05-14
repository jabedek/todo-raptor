import { useEffect } from "react";
import { usePopupContext } from "@@components/Layout";

type Props = {
  children: React.ReactNode;
};

const Page: React.FC<Props> = ({ children }) => {
  const { hidePopup } = usePopupContext();

  useEffect(() => {
    // hidePopup();
  }, []);

  return <div className="app_layout_padding w-full h-[220vh] mt-[40px]">{children}</div>;
};

export default Page;
