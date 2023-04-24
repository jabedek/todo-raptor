import { Project } from "@@types/Project";
import { Link } from "react-router-dom";

interface Props {
  projects: Project[];
}

const ProjectsList: React.FC<Props> = ({ projects }) => {
  console.log("2", projects);
  return (
    <div className="w-full h-auto p-3 bg-white">
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <Link to={`/project/${project.id}`}>
              {project.title} {project.id}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectsList;
