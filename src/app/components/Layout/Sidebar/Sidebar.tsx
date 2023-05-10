import { CallbackFn } from "frotsi";
import { MdArrowForward } from "react-icons/md";

type Props = {
  isVisible: boolean;
  clickFn: CallbackFn;
};

const Sidebar: React.FC<Props> = ({ isVisible, clickFn }) => (
  <>
    <div
      className={`${isVisible ? "left-0" : "-left-[220px]"} delay-200 transition-all duration-200
      z-50 fixed sidebar-blur sidebar-overlay  flex content-center items-center justify-between w-[220px] h-full  bg-gray-300 bg-opacity-60 text-sm font-semibold font-app_primary px-8 py-2`}>
      <div
        className={` left-[220px]  top-0
      z-[49] fixed sidebar-overlay app_flex_center  w-[60px] h-[50px] transition-all duration-200  hover:bg-gray-300  bg-gray-300 bg-opacity-90   text-sm font-semibold font-app_primary rounded-r-full cursor-pointer`}
        onClick={() => clickFn(!isVisible)}>
        <div className={`transition-all duration-400 ${isVisible ? "rotate-180" : "rotate-0"} app_flex_center w-[30px] h-[30px]`}>
          <MdArrowForward className="text-[1.25em] text-gray-700" />
        </div>
      </div>
      <div className="app_flex_center">
        <span className="px-3 text-[17px]">Task-o-saurus</span>
      </div>
    </div>
    <div
      className={`fixed z-30 app_header_top  h-full 
      ${isVisible ? "sidebar-in-transition" : "sidebar-out-transition"} `}
      onClick={() => clickFn(false)}></div>
  </>
);

export default Sidebar;
