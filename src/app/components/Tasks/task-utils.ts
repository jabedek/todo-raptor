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

export const getShortId = (id: string): string =>
  `${id.substring(0, 1)}_${id.substring(15, 16)}${id.substring(18, 20)}_${id.substring(id.length - 3)}`;
