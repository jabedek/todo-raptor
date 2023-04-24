import { TaskProgressStatus } from "@@components/Tasks/TaskStatus/task-statuses";
import { VisualElements } from "./common";

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
};
