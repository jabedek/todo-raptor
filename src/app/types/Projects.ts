import { ProjectRole, ProjectRoleShortName } from "@@components/RolesStatusesVisuals/roles-statuses-visuals";
import { Flatten } from "./common";
import { AuthenticationDetails, PersonalDetails } from "./Users";

export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  managerId: string;
  originalCreatorId: string;
  assignees: ProjectAssignee[];
  tasksIds: string[];
  tasksCounter: number;
  status: ProjectStatus;
  archived: boolean;
  createdAt: string;
  closedAt: string;
  kanbanColumnsOrder: [""];
};

export type ProjectStatus = "active" | "completed" | "cancelled";

export type ProjectAssignee = Flatten<
  Pick<AuthenticationDetails, "id" | "email"> & {
    role: ProjectRoleShortName;
  }
>;

export type ProjectAssigneeFull = Flatten<
  Pick<AuthenticationDetails, "id" | "email"> & {
    role: ProjectRoleShortName;
  } & Partial<PersonalDetails> & {
      roleDetails?: Flatten<ProjectRole>;
    }
>;

export type UnboundAssignee = Flatten<Pick<ProjectAssignee, "id" | "email"> & Partial<PersonalDetails>>;
