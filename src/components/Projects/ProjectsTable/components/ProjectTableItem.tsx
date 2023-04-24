import { Project } from "@@types/Project";
import { CallbackFn } from "frotsi";
type Props = {
  project: Project;
  deleteFn?: CallbackFn;
};
const ProjectTableItem: React.FC<Props> = ({ project }) => {
  return (
    <>
      <div className="h-[100px] w-[100px] border border-gray-400 border-solid app_flex_center">
        {/* Project Title, Action (delete), Tags */}
        <div>
          <p>{project.title}</p>
        </div>

        {/* Project Description */}
        <div>
          <p>{project.description}</p>
        </div>

        {/* Controls to edit project, see and add tasks etc, tasks number. */}
        <div>
          <div>O</div>
          <div>O</div>
          <div>O</div>
          <div>O</div>
        </div>

        {/* Team Members Avatars (letters) */}
        <div>
          <div className="team-member">AB</div>
          <div className="team-member">AJ</div>
          <div className="team-member">JK</div>
          <div className="team-member">LP</div>
        </div>

        {/* Project badge showing user's relation to it */}
        <div></div>
      </div>
    </>
  );
};

export default ProjectTableItem;
