import { Flatten } from "frotsi";
import { IdEmailPair } from "./common";
import { PersonalDetails } from "./Users";
import { ProjectRole, ProjectRoleShortName, ProjectStatusName } from "@@components/Projects/visuals/project-visuals";
import { DeepFlatten } from "frotsi/dist/types";

export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  managerId: string;
  productOwnerId: string;
  originalCreatorId: string;
  assignees: SimpleAssignee[];
  tasksLists: TasksLists;
  tasksCounter: number;
  status: ProjectStatusName;
  archived: boolean;
  createdAt: string;
  closedAt: string;
};

export type FullProject = Project & { assigneesRegistry: AssigneesRegistry };

export type TasksLists = {
  scheduleId: string;
  backlog: string[];
};

export type SimpleAssignee = Flatten<IdEmailPair & { role: ProjectRoleShortName }>;
export type UnboundAssignee = Flatten<IdEmailPair & Partial<PersonalDetails>>;
export type FullAssignee = DeepFlatten<SimpleAssignee & Partial<PersonalDetails> & { roleDetails?: ProjectRole }>;

export type UnboundAssigneesRegistry = Record<string, UnboundAssignee>;
export type AssigneesRegistry = Record<string, FullAssignee>;

export type ProjectsSeparated = {
  active: FullProject[];
  archived: FullProject[];
};

export type ProjectBlockade =
  | "block block-archived"
  | "block block-cancelled"
  | "block block-completed"
  | "block block-dragging"
  | undefined;
