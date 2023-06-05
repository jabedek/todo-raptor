import { FullTask, AssigneesRegistry, SimpleTask } from "@@types";
import { getTaskStatusDetails } from "./visuals/task-visuals";

export const enrichTasksWithAssignees = (assignees: AssigneesRegistry, tasks: SimpleTask[]): FullTask[] => {
  const tasksWithDetails: FullTask[] = tasks.map((task) => ({
    ...task,
    assigneeDetails: assignees[task.assigneeId],
    statusDetails: getTaskStatusDetails(task.status),
  }));

  return tasksWithDetails;
};
