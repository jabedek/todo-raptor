import { Project } from "@@types/Project";
import { Link } from "react-router-dom";

interface Props {
  projects: Project[];
}

const ProjectList: React.FC<Props> = ({ projects }) => {
  console.log("2", projects);
  return (
    <ul>
      {projects.map((project) => (
        <li key={project.id}>
          <Link to={`/project/${project.id}`}>
            {project.name} {project.id}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default ProjectList;
