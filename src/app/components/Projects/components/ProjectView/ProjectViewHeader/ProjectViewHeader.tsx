import { CallbackFn } from "frotsi";
import { Icons } from "@@components/Layout";

type Props = {
  tab: "schedule" | "backlog";
  projectTitle: string | undefined;
  setTabFn: CallbackFn;
};

export const ProjectViewHeader: React.FC<Props> = ({ tab, projectTitle, setTabFn }) => {
  return (
    <div className="project-view-header  bg-white text-[14px] project-border border border-x-0 uppercase">
      <div
        className={`header-tab-wrapper ${tab === "backlog" && "selected"}`}
        onClick={() => setTabFn("backlog")}>
        <div className="app_flex_center ">
          <Icons.MdShelves className={`projects-header-icon text-indigo-400`} />
          <p>Backlog</p>
        </div>
      </div>

      <div
        className={`header-tab-wrapper ${tab === "schedule" && "selected"}`}
        onClick={() => setTabFn("schedule")}>
        <div className="app_flex_center ">
          <Icons.MdViewColumn className={`projects-header-icon text-sky-400`} />
          <p>Schedule</p>
        </div>
      </div>
    </div>
  );
};
