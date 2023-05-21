import { Icons } from "@@components/Layout";
import { CallbackFn } from "frotsi";

type Props = {
  tab: "schedule" | "backlog";
  projectTitle: string | undefined;
  setTabFn: CallbackFn;
};

const ProjectViewHeader: React.FC<Props> = (props) => {
  return (
    <div className="project-view-header  bg-white text-[14px] project-border border border-x-0 uppercase">
      <div
        className={`header-tab-wrapper ${props.tab === "backlog" && "selected"}`}
        onClick={() => props.setTabFn("backlog")}>
        <div className="app_flex_center ">
          <Icons.MdShelves className={`projects-header-icon text-indigo-400`} />
          <p>Backlog</p>
        </div>
      </div>

      <div
        className={`header-tab-wrapper ${props.tab === "schedule" && "selected"}`}
        onClick={() => props.setTabFn("schedule")}>
        <div className="app_flex_center ">
          <Icons.MdViewColumn className={`projects-header-icon text-sky-400`} />
          <p>Schedule</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectViewHeader;
