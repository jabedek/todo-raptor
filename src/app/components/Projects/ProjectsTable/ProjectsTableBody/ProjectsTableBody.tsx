import { ProjectTypes, UserTypes } from "@@types";
import ProjectsTableItem from "../ProjectsTableItem/ProjectsTableItem";
import { CallbackFn } from "frotsi";

type Props = {
  projects: ProjectTypes.Project[];
  user: UserTypes.User | undefined;
  deleteProjectFn: CallbackFn<Promise<void>>;
};

const ProjectsTableBody: React.FC<Props> = (props) => {
  return (
    <div className="table-body  ">
      {props.user &&
        props.projects.map((project, i) => (
          <ProjectsTableItem
            project={project}
            user={props.user}
            deleteFn={() => props.deleteProjectFn(project.id)}
            key={i}
          />
        ))}
    </div>
  );
};

export default ProjectsTableBody;
