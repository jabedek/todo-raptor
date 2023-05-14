import { CallbackFn } from "frotsi";

import ProjectBadge from "./ProjectBadge/ProjectBadge";

type Props = {
  tab: "manage" | "work" | "archived";
  setTabFn: CallbackFn;
};

const ProjectsTableHeader: React.FC<Props> = (props) => {
  return (
    <>
      <div className="table-header bg-white text-[14px] project-border border border-r-0">
        <div
          className={`header-tab-wrapper ${props.tab === "manage" && "selected"}`}
          onClick={() => props.setTabFn("manage")}>
          <ProjectBadge
            variant="manage"
            label="Projects you manage"
          />
        </div>

        <div
          className={`header-tab-wrapper ${props.tab === "work" && "selected"}`}
          onClick={() => props.setTabFn("work")}>
          <ProjectBadge
            variant="work"
            label="Projects you are managed in"
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
