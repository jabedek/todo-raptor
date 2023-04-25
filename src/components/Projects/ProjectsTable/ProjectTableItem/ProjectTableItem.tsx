import { CallbackFn } from "frotsi";

import { ProjectTypes } from "@@types";

type Props = {
  project: ProjectTypes.Project;
  deleteFn?: CallbackFn;
};
const ProjectTableItem: React.FC<Props> = ({ project }) => {
  return (
    <>
      <div className="h-[240px] w-[240px] p-3 flex flex-col justify-between bg-white border border-gray-300 border-solid  rounded-[4px] ">
        {/* Project Title, Action (delete), Tags */}
        <div className="flex w-full font-[800] text-[16px]">
          <p>{project.title}</p>
          <p>{project.tags.join(", ")}</p>
        </div>

        {/* Project Description */}
        <div className="flex w-full font-[400] text-[13px] text-gray-500 h-[60px] italic">
          <p>{project.description}</p>
        </div>

        {/* Controls to edit project, see and add tasks etc, tasks number. */}
        <div className="flex w-full ">
          <div>O</div>
          <div>O</div>
          <div>O</div>
          <div>O</div>
        </div>

        {/* Team Members Avatars (letters) */}
        <div className="flex w-full ">
          <div className="team-member">AB</div>
          <div className="team-member">AJ</div>
          <div className="team-member">JK</div>
          <div className="team-member">LP</div>
        </div>

        {/* Project status and project badge showing user's relation to it */}
        <div className="flex w-full">
          <p>{project.status}</p>
        </div>
      </div>
    </>
  );
};

export default ProjectTableItem;
