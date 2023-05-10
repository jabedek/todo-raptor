import { VisualElements } from "./common";
import { AuthenticationDetails } from "./User";

export type ProjectStatus = "active" | "completed" | "cancelled";

/**
 * Represents general/basic roles, but also allows for setting project-specific roles.
 * @examples `project#frontend-developer`, `project#designer`
 */
export type ProjectTeamMemberRole =
  | "manager"
  | "vice-manager"
  | "team-leader"
  | "coworker"
  | "intern"
  | "spectator"
  | `project#${string}`;

export type ProjectTeamMember = Pick<AuthenticationDetails, "id" | "email"> & {
  nickname: string;
  role: ProjectTeamMemberRole;
};

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
