import { FullProject, User } from "@@types";
import { ProjectsTableItem } from "@@components/Projects";

type Props = {
  projects: FullProject[];
  user: User | undefined;
};

export const ProjectsTableBody: React.FC<Props> = ({ projects, user }) => (
  <div className="table-body">
    {user &&
      projects.map((project, i) => (
        <ProjectsTableItem
          project={project}
          user={user}
          key={i}
        />
      ))}
  </div>
);
