import { User } from "./User";

export type ProjectUser = Omit<User, "projects" | "joinedAt">;

export type Project = {
  id: string;
  name: string;
  manager: ProjectUser;
  assignees: ProjectUser[];
  tasksIds: string[];
};
