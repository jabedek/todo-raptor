import { TaskProgressStatus } from "@@components/Tasks/TaskStatus/utils/task-statuses";
import { VisualElements } from "./common";

export type TaskList = "backlog" | "schedule" | "archive";

export type Task = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  assigneeId: string;
  status: TaskProgressStatus;
  projectId: string;
  createdAt: string;
  closedAt: string | undefined;
  visuals: VisualElements;
  onList: TaskList;
};
