import { Flatten, VisualElements } from "./common";
import { AuthenticationDetails } from "./Users";

export type ProjectStatus = "active" | "completed" | "cancelled";

/**
 * Represents general/basic roles, but also allows for setting project-specific roles.
 * @examples `project#frontend-developer`, `project#designer`
 */
export type ProjectTeamMemberRole =
  | "manager"
  | "product-owner"
  | "vice-manager"
  //
  | "team-leader"
  //
  | "analyst"
  | "designer"
  //
  | "intern"
  | "coworker" // generic
  //
  | "tester"
  //
  | "ui-designer"
  //
  | "developer"
  //
  | "spectator"
  //
  | `project#${string}`; // custom;

export type ProjectTeamMember = Flatten<
  Pick<AuthenticationDetails, "id" | "email"> & {
    role: ProjectTeamMemberRole;
    roleColor: string;
  }
>;

export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  managerId: string;
  originalCreatorId: string;
  teamMembers: ProjectTeamMember[];
  tasksIds: string[];
  status: ProjectStatus;
  archived: boolean;
  createdAt: string;
  visuals: VisualElements;
};

export type ProjectsTableData = {
  activeManaged: Project[];
  activeWorking: Project[];
  archivedManaged: Project[];
  archivedWorking: Project[];
};
