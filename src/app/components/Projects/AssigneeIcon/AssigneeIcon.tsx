import { useEffect, useState } from "react";
import "./AssigneeIcon.scss";
import { getUserDisplayName } from "../projects-utils";
import { FullAssignee } from "@@types";
import { Flatten } from "frotsi";

type Props = {
  assignee: Flatten<Partial<FullAssignee>> | "..." | undefined;
  tailwindStyles?: string;
};

const AssigneeIcon: React.FC<Props> = ({ assignee, tailwindStyles }) => {
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

export default AssigneeIcon;
