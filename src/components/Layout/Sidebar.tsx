import { CallbackFn } from "frotsi";
import { MdArrowForward } from "react-icons/md";

type Props = {
  isOpened: boolean;
  setState: CallbackFn;
};

const Sidebar: React.FC<Props> = ({ isOpened, setState }) => (
  <>
    <div
      className={`${isOpened ? "left-0" : "-left-[220px]"} delay-200 transition-all duration-200
      z-50 fixed sidebar-blur sidebar-overlay  flex content-center items-center justify-between w-[220px] h-full  bg-gray-300 bg-opacity-60 text-sm font-semibold font-app_primary px-8 py-2`}>
      <div
        className={` left-[220px]  top-0
      z-[49] fixed sidebar-overlay app_flex_center  w-[60px] h-[50px] transition-all duration-200  hover:bg-gray-300 hover:bg-opacity-80  bg-gray-300 bg-opacity-60 text-sm font-semibold font-app_primary rounded-r-full cursor-pointer`}
        onClick={() => setState(!isOpened)}>
        <div className={`transition-all duration-400 ${isOpened ? "rotate-0" : "rotate-180"} app_flex_center w-[30px] h-[30px]`}>
          <MdArrowForward className="text-[1.25em] text-gray-700" />
        </div>
      </div>
      <div className="app_flex_center">
        <span className="px-3 text-[17px]">Task-o-saurus</span>
      </div>
    </div>
    <div
      className={`fixed z-30 app_header_top  h-full 
      ${isOpened ? "sidebar-in-transition" : "sidebar-out-transition"} `}
      onClick={() => setState(false)}></div>
  </>
);

export default Sidebar;
