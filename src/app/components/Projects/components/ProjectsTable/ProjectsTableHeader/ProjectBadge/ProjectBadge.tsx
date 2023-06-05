import { useLayoutEffect, useState } from "react";
import { Icons } from "@@components/Layout";

type Props = { variant: "active" | "archived"; label?: string };

export const ProjectBadge: React.FC<Props> = ({ variant, label }) => {
  const [color, setcolor] = useState("");

  useLayoutEffect(() => {
    let val = "";
    switch (variant) {
      case "active":
        val = "text-orange-300";
        break;
      case "archived":
        val = "text-indigo-300";
        break;
    }
    setcolor(val);
  }, [{ variant }]);

  return (
    <>
      <div className=" app_flex_center">
        {variant === "archived" && <Icons.MdInventory className={`projects-header-icon ${color}`} />}
        {variant !== "archived" && <Icons.MdCardMembership className={`projects-header-icon ${color}`} />}

        <p>{label + ""}</p>
      </div>
    </>
  );
};
