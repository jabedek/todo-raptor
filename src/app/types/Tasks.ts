import { TaskStatus, TaskStatusShortName } from "@@components/Tasks/visuals/task-visuals";
import { FullAssignee } from "@@types";
import { Flatten } from "frotsi";

export type SimpleTask = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  taskNumber: number;
  assigneeId: string;
  status: TaskStatusShortName;
  projectId: string;
  createdAt: string;
  closedAt: string;
};

export type FullTask = Flatten<SimpleTask & { statusDetails: TaskStatus } & { assigneeDetails: FullAssignee | undefined }>;

export type FullTasksRegistry = Record<string, FullTask>;
