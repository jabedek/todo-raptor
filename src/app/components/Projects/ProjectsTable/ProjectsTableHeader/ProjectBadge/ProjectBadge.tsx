import { useState, useLayoutEffect } from "react";

import { ReactIcons } from "@@components/Layout/preloaded-icons";

const ProjectBadge: React.FC<{ variant: "manage" | "work" | "archived"; label?: string }> = (props) => {
  const [color, setcolor] = useState("");

  useLayoutEffect(() => {
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
        {props.variant === "archived" && <ReactIcons.MdInventory className={`project-icon ${color}`} />}
        {props.variant !== "archived" && <ReactIcons.MdCardMembership className={`project-icon ${color}`} />}

        <p>{props.label + ""}</p>
      </div>
    </>
  );
};

export default ProjectBadge;
