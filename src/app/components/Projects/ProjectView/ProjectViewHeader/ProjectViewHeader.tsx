import { ReactIcons } from "@@components/Layout/preloaded-icons";
import { CallbackFn } from "frotsi";

type Props = {
  tab: "schedule" | "backlog" | "archive";
  projectTitle: string | undefined;
  setTabFn: CallbackFn;
};

const ProjectViewHeader: React.FC<Props> = (props) => {
  return (
    <div className="project-view-header  bg-white text-[14px] project-border border border-x-0">
      <div
        className={`header-tab-wrapper ${props.tab === "backlog" && "selected"}`}
        onClick={() => props.setTabFn("backlog")}>
        <div className="app_flex_center ">
          <ReactIcons.MdShelves className={`project-icon text-indigo-400`} />
          <p>Backlog</p>
        </div>
      </div>

      <div
        className={`header-tab-wrapper ${props.tab === "schedule" && "selected"}`}
        onClick={() => props.setTabFn("schedule")}>
        <div className="app_flex_center ">
          <ReactIcons.MdViewColumn className={`project-icon text-sky-400`} />
          <p>Schedule</p>
        </div>
      </div>

      <div
        className={`header-tab-wrapper ${props.tab === "archive" && "selected"}`}
        onClick={() => props.setTabFn("archive")}>
        <div className="app_flex_center ">
          <ReactIcons.MdInventory className={`project-icon text-gray-500`} />
          <p>Archive</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectViewHeader;
