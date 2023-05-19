import { ProjectTypes } from "@@types";
import {
  ProjectRole,
  StatusGroupName,
  TaskListType,
  TaskStatus,
  TaskStatusShortName,
} from "@@components/RolesStatusesVisuals/roles-statuses-visuals";
import { Flatten } from "./common";
import { ProjectAssigneeFull } from "./Projects";

export type Task = {
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
  list: {
    type: TaskListType;
    position: number;
    scheduleColumn: StatusGroupName | "";
  };
};

export type TaskWithDetails = Flatten<
  Task & { statusDetails: TaskStatus } & { assigneeDetails: ProjectTypes.ProjectAssigneeFull | undefined }
>;
