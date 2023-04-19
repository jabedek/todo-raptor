import React, { useContext, useEffect, useState } from "react";

// import { getTasksByIds } from "../firebase/tasks";
import { Task } from "@@types/Task";
import { useLoaderData } from "react-router-dom";

type Props = {};

const ProjectPanel: React.FC<Props> = () => {
  //   const [project, setProject] = useState(projects.find((p) => p.id === projectId));
  //   const [tasks, setTasks] = useState<Task[]>([]);

  //   useEffect(() => {
  //     setProject(projects.find((p) => p.id === projectId));
  //   }, [projectId, projects]);

  //   useEffect(() => {
  //     if (project) {
  //       getTasksByIds(project.tasksIds).then((tasks) => setTasks(tasks));
  //     }
  //   }, [project]);

  return (
    <div>
      ProjectPanel
      {/* <h2>{project?.name}</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <div>{task.title}</div>
            <div>Status: {task.status}</div>
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default ProjectPanel;
