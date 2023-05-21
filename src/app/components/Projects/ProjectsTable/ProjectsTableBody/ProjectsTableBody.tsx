import { CallbackFn } from "frotsi";
import { Project, User } from "@@types";
import ProjectsTableItem from "../ProjectsTableItem/ProjectsTableItem";

type Props = {
  projects: Project[];
  user: User | undefined;
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
