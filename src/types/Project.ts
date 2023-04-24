import { VisualElements } from "./common";
import { AuthData } from "./User";

export type ProjectStatus = "active" | "completed" | "cancelled" | "archived-completed" | "archived-cancelled";

/**
 * Represents general/basic roles, but also allows for setting project-specific roles.
 * @examples `project#frontend-developer`, `project#designer`
 */
export type ProjectTeamMemberRole = "manager" | "team-leader" | "coworker" | "intern" | "spectator" | `project#${string}`;

export type ProjectTeamMember = {
  userId: string;
  role: ProjectTeamMemberRole;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  manager: AuthData;
  originalCreatorId: string;
  teamMembers: ProjectTeamMember[];
  tasksIds: string[];
  status: ProjectStatus;
  createdAt: string;
  visuals: VisualElements;
};
