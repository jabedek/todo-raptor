import { Icons } from "@@components/Layout";
import { useLayoutEffect, useState } from "react";

type Props = { variant: "active" | "archived"; label?: string };

const ProjectBadge: React.FC<Props> = (props) => {
  const [color, setcolor] = useState("");

  useLayoutEffect(() => {
    let val = "";
    switch (props.variant) {
      case "active":
        val = "text-orange-300";
        break;
      case "archived":
        val = "text-indigo-300";
        break;
    }
    setcolor(val);
  }, [props]);

  return (
    <>
      <div className=" app_flex_center">
        {props.variant === "archived" && <Icons.MdInventory className={`projects-header-icon ${color}`} />}
        {props.variant !== "archived" && <Icons.MdCardMembership className={`projects-header-icon ${color}`} />}

        <p>{props.label + ""}</p>
      </div>
    </>
  );
};

export default ProjectBadge;
