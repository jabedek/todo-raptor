import { Flatten, IdEmailPair } from "./common";
import { PersonalDetails } from "./Users";
import { ProjectRoleShortName, ProjectRole, ProjectStatusName } from "@@components/Projects/visuals/project-visuals";

export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  managerId: string;
  productOwnerId: string;
  originalCreatorId: string;
  assignees: SimpleProjectAssignee[];
  tasksLists: TasksLists;
  tasksCounter: number;
  status: ProjectStatusName;
  archived: boolean;
  createdAt: string;
  closedAt: string;
};

export type TasksLists = {
  scheduleId: string;
  backlog: string[];
};

export type SimpleProjectAssignee = Flatten<IdEmailPair & { role: ProjectRoleShortName }>;
export type FullProjectAssignee = Flatten<
  SimpleProjectAssignee & Partial<PersonalDetails> & { roleDetails?: Flatten<ProjectRole> }
>;
export type ProjectAssigneesRegistry = Record<string, FullProjectAssignee>;
export type ProjectWithAssigneesRegistry = Flatten<Project & { assigneesRegistry: ProjectAssigneesRegistry }>;

export type UnboundAssignee = Flatten<IdEmailPair & Partial<PersonalDetails>>;
export type UnboundAssigneesRegistry = Record<string, UnboundAssignee>;

export type ProjectsFullData = {
  active: ProjectWithAssigneesRegistry[];
  archived: ProjectWithAssigneesRegistry[];
};
