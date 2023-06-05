import { CallbackFn } from "frotsi";

import { ProjectBadge } from "./ProjectBadge/ProjectBadge";

type Props = {
  tab: "active" | "archived";
  setTabFn: CallbackFn;
};

export const ProjectsTableHeader: React.FC<Props> = ({ tab, setTabFn }) => {
  return (
    <>
      <div className="table-header bg-white text-[14px] project-border border border-r-0 uppercase">
        <div
          className={`header-tab-wrapper ${tab === "active" && "selected"}`}
          onClick={() => setTabFn("active")}>
          <ProjectBadge
            variant="active"
            label="Active projects"
          />
        </div>

        <div
          className={`header-tab-wrapper ${tab === "archived" && "selected"}`}
          onClick={() => setTabFn("archived")}>
          <ProjectBadge
            variant="archived"
            label="Archived Projects"
          />
        </div>
      </div>
      ;
    </>
  );
};
