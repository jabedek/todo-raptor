import { TasksVisuals } from "@@components/Tasks";
import {
  TaskStatusShortName,
  TaskListType,
  StatusGroupName,
  TaskStatus,
  StatusGroup,
} from "@@components/Tasks/visuals/task-visuals";
import { Flatten, FullProjectAssignee } from "@@types";

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
