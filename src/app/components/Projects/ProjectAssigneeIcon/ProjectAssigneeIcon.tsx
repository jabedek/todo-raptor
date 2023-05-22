import { useState, useEffect } from "react";
import "./ProjectAssigneeIcon.scss";
import { getUserDisplayName } from "../projects-utils";
import { Flatten, FullProjectAssignee } from "@@types";

type Props = {
  assignee: Flatten<Partial<FullProjectAssignee>> | "..." | undefined;
  tailwindStyles?: string;
};

const ProjectAssigneeIcon: React.FC<Props> = ({ assignee, tailwindStyles }) => {
  const [displayName, setdisplayName] = useState<string>();
  const [assigneeStyles, setassigneeStyles] = useState("");

  useEffect(() => {
    if (assignee) {
      if (assignee !== "...") {
        if (assignee.names) {
          const display = getUserDisplayName({ email: `${assignee.email}`, names: assignee.names });
          setdisplayName(display);
        }

        if (assignee.roleDetails?.styleClasses) {
          setassigneeStyles(` assignee-icon ${assignee.roleDetails?.styleClasses[1]}`);
        }
      } else {
        setdisplayName(undefined);
      }
    }
  }, [assignee]);
  return (
    <>
      {assignee && (
        <div
          className={`icon-circle ${assigneeStyles} relative font-app_mono text-[10px] h-[25px] w-[25px]
       rounded-full app_flex_center border-2 border-white border-solid ${tailwindStyles}`}>
          {displayName ? (
            <p className="rounded-full h-[21px] w-[21px] text-center leading-[21px]">{displayName}</p>
          ) : (
            <p className="rounded-full  tracking-[-1.5px]">...</p>
          )}
        </div>
      )}
    </>
  );
};

export default ProjectAssigneeIcon;
