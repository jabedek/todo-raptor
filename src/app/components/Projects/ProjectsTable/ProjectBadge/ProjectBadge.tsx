import { useState, useEffect } from "react";
import { MdCardMembership, MdInventory } from "react-icons/md";

import "./ProjectBadge.scss";

const ProjectBadge: React.FC<{ variant: "manage" | "work" | "archived"; label?: string }> = (props) => {
  const [color, setcolor] = useState("");

  useEffect(() => {
    let val = "";
    switch (props.variant) {
      case "manage":
        val = "text-lime-300";
        break;
      case "work":
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
        {props.variant === "archived" && <MdInventory className={`project-badge-icon ${color}`} />}
        {props.variant !== "archived" && <MdCardMembership className={`project-badge-icon ${color}`} />}

        <p>{props.label + ""}</p>
      </div>
    </>
  );
};

export default ProjectBadge;
