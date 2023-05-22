import { ProjectWithAssigneesRegistry, User } from "@@types";
import ProjectsTableItem from "../ProjectsTableItem/ProjectsTableItem";

type Props = {
  projects: ProjectWithAssigneesRegistry[];
  user: User | undefined;
};

const ProjectsTableBody: React.FC<Props> = (props) => {
  return (
    <div className="table-body  ">
      {props.user &&
        props.projects.map((project, i) => (
          <ProjectsTableItem
            project={project}
            user={props.user}
            key={i}
          />
        ))}
    </div>
  );
};

export default ProjectsTableBody;
