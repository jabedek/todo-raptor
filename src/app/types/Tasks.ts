import { TaskProgressStatus, TaskStatusDetails } from "@@components/Tasks/TaskStatus/utils/task-statuses";
import { VisualElements } from "./common";
import { ProjectTypes } from "@@types";

export type TaskListType = "backlog" | "schedule" | "archive";

export type Task = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  taskNumber: number;
  assigneeId: string;
  status: TaskProgressStatus;
  projectId: string;
  createdAt: string;
  closedAt: string | undefined;
  visuals: VisualElements;
  onList: TaskListType;
};

export type TaskWithDetails = Task & {
  statusDetails: TaskStatusDetails;
  assigneeDetails: ProjectTypes.ProjectTeamMember | undefined;
};
