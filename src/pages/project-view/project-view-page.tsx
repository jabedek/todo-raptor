import { useLoaderData, useParams } from "react-router-dom";

const ProjectViewPage: React.FC = () => {
  //   const { projectID } = useParams<{ projectID: string }>();
  const { paramId, data } = useParams();
  const item = useLoaderData();

  console.log("5", paramId, data, item);
  // Use the projectID parameter to find the corresponding project object
  //   const selectedProject = project.id === projectID ? project : null;

  //   if (!selectedProject) {
  //     return <div>Project not found</div>;
  //   }

  return (
    <div>
      {/* <h2>{selectedProject.name}</h2>
      <p>Manager: {selectedProject.manager.displayName}</p>
      <p>Assignees:</p>
      <ul>
        {selectedProject.assigneesIds.map((assignee) => (
          <li key={assignee.id}>{assignee.displayName}</li>
        ))}
      </ul>
      <p>Tasks:</p>
      <ul>
        {selectedProject.tasksIds.map((taskId) => (
          <li key={taskId}>{taskId}</li>
        ))}
      </ul> */}
    </div>
  );
};

export default ProjectViewPage;
