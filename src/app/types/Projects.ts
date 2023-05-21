import { ProjectsVisuals } from "@@components/Projects";
import { Flatten, IdEmailPair } from "./common";
import { AuthenticationDetails, PersonalDetails } from "./Users";
import { StatusGroup, StatusGroupName, TaskStatusShortName } from "@@components/Tasks/visuals/task-visuals";
import { SimpleTask, FullTask } from "./Tasks";
import { ProjectRoleShortName, ProjectRole } from "@@components/Projects/visuals/project-visuals";

export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  managerId: string;
  originalCreatorId: string;
  assignees: SimpleProjectAssignee[];
  tasksLists: TasksLists;
  tasksCounter: number;
  status: ProjectStatus;
  archived: boolean;
  createdAt: string;
  closedAt: string;
};

export type TasksLists = {
  scheduleId: string;
  backlog: string[];
};

export type Schedule<S extends ScheduleColumnType> = Flatten<{
  id: string;
  projectId: string;
  columns: ScheduleColumns<S>;
}>;

export type SimpleColumn = Flatten<{
  id: StatusGroupName;
  statuses: TaskStatusShortName[];
  tasksIdsOrdered: string[];
}>;

export type ScheduleColumnType = SimpleColumn | FullColumn<TaskType>;
type TaskType = SimpleTask | FullTask;

export type FullColumn<T extends TaskType> = Flatten<SimpleColumn & { tasks: T[] }>;

export type ScheduleColumns<ScheduleColumnType> = {
  a_new: ScheduleColumnType;
  b_working: ScheduleColumnType;
  c_checking: ScheduleColumnType;
  d_done: ScheduleColumnType;
};

export type ScheduleAction = { oldColumn: string; column: string; action: "add-to-schedule" | "move" | "remove-from-schedule" };

export type ProjectStatus = "active" | "completed" | "cancelled";

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
