import { useEffect, useState } from "react";
import { ProjectStatus } from "@@types";

type Props = { status: ProjectStatus; userIsCreator: boolean; userIsManager: boolean };

const ProjectList: React.FC<Props> = ({ status, userIsCreator, userIsManager }) => {
  const [color, setcolor] = useState("");

  useEffect(() => {
    switch (status) {
      case "active":
        setcolor("rgba(50,90,170,1)");
        break;
      case "completed":
        setcolor("rgba(50,170,90,1)");
        break;
      case "cancelled":
        setcolor("rgba(190,50,50,1)");
        break;
      default:
        setcolor("gray");
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

export default ProjectList;
