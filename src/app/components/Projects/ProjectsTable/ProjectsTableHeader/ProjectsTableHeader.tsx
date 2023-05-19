import { CallbackFn } from "frotsi";

import ProjectBadge from "./ProjectBadge/ProjectBadge";

type Props = {
  tab: "active" | "archived";
  setTabFn: CallbackFn;
};

const ProjectsTableHeader: React.FC<Props> = (props) => {
  return (
    <>
      <div className="table-header bg-white text-[14px] project-border border border-r-0 uppercase">
        <div
          className={`header-tab-wrapper ${props.tab === "active" && "selected"}`}
          onClick={() => props.setTabFn("active")}>
          <ProjectBadge
            variant="active"
            label="Active projects"
          />
        </div>

        <div
          className={`header-tab-wrapper ${props.tab === "archived" && "selected"}`}
          onClick={() => props.setTabFn("archived")}>
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

export default ProjectsTableHeader;
