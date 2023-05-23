import { TaskStatusShortName, TaskStatus } from "@@components/Tasks/visuals/task-visuals";
import { FullProjectAssignee } from "@@types";
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

export type FullTask = Flatten<SimpleTask & { statusDetails: TaskStatus } & { assigneeDetails: FullProjectAssignee | undefined }>;

export type TasksSchedule<T = SimpleTask | FullTask> = {
  a_new: T[];
  b_working: T[];
  c_checking: T[];
  d_done: T[];
};

export type FullTasksRegistry = Record<string, FullTask>;
