import { TaskProgressStatus } from "@@components/TaskStatus/task-statuses";

export type ProjectUser = Omit<User, "projects" | "joinedAt">;

export type Project = {
  id: string;
  name: string;
  manager: ProjectUser;
  assignees: ProjectUser[];
  tasksIds: string[];
};

export type Task = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  assigneeId: string;
  status: TaskProgressStatus;
  projectId: string;
  createdAt: string;
  closedAt: string | undefined;
};

export type User = {
  id: string | null | undefined;
  displayName: string | null | undefined;
  email: string | null | undefined;
  projectsIds: string[];
  tasksIds: string[];
  joinedAt: string;
};

export type AuthUser = Omit<User, "projectsIds" | "tasksIds" | "joinedAt">;
