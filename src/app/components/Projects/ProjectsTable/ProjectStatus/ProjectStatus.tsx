import { useEffect, useState } from "react";
import { MdCheckCircleOutline, MdContentPasteOff, MdOutlineConstruction, MdOutlineLayers } from "react-icons/md";

import { ProjectTypes } from "@@types";

const ProjectStatus: React.FC<{ status: ProjectTypes.ProjectStatus; userIsCreator: boolean; userIsManager: boolean }> = ({
  status,
  userIsCreator,
  userIsManager,
}) => {
  const [color, setcolor] = useState("");
  const [icon, seticon] = useState<JSX.Element>();

  useEffect(() => {
    switch (status) {
      case "active":
        setcolor("rgba(50,90,170,1)");
        seticon(<MdOutlineConstruction />);
        break;
      case "completed":
        setcolor("rgba(50,170,90,1)");
        seticon(<MdCheckCircleOutline />);
        break;
      case "cancelled":
        setcolor("rgba(190,50,50,1)");
        seticon(<MdContentPasteOff />);
        break;
      default:
        setcolor("gray");
        seticon(<MdOutlineLayers />);
        break;
    }
  }, [status]);

  return (
    <>
      <div className="uppercase font-black text-stone-500 text-[9px] flex flex-col align-baseline min-w-[100px]">
        {userIsCreator && <p>Created by you</p>}
        {userIsManager && <p className="text-app_primary">Managed by you</p>}
        <span
          className="top-[1px]  text-white w-fit px-1 rounded-sm "
          style={{ backgroundColor: color }}>
          {status}
        </span>
      </div>
    </>
  );
};

export default ProjectStatus;
