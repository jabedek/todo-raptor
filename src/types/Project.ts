import { User } from "./User";

export type ProjectUser = Pick<User, "id" | "email" | "displayName">;

export type Project = {
  id: string;
  name: string;
  manager: ProjectUser;
  originalCreatorId: string;
  assigneesIds: ProjectUser[];
  tasksIds: string[];
};
