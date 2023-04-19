import { TaskProgressStatus } from "@@components/TaskStatus/task-statuses";
import { ProjectUser } from "./Project";

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
};
