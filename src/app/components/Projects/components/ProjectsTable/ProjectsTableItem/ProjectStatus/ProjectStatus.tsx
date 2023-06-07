import { ProjectStatusName } from "@@components/Projects";

type Props = { status: ProjectStatusName; userIsCreator: boolean; userIsManager: boolean };

export const ProjectStatus: React.FC<Props> = ({ status, userIsCreator, userIsManager }) => {
  return (
    <div className="uppercase font-black text-stone-500 text-[9px] flex flex-col align-bottom min-w-[100px] min-h-[42px] max-h-[42px] justify-end">
      {userIsCreator && <p>Created by you</p>}
      {userIsManager && <p className="text-app_primary">Managed by you</p>}

      <p className={`top-[1px] project-status-bg-${status}`}>{status}</p>
    </div>
  );
};
