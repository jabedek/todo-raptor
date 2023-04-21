import { TaskProgressStatus } from "@@components/TaskStatus/task-statuses";

export type ProjectUser = Pick<User, "id" | "email" | "displayName">;

export type Project = {
  id: string;
  name: string;
  manager: ProjectUser;
  originalCreatorId: string;
  assigneesIds: ProjectUser[];
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

export type UserData = {
  projects: {
    projectsIdsCreated: string[];
    projectsIdsManaged: string[];
    projectsIdsWorking: string[];
  };
  tasks: {
    tasksIdsWorking: string[];
    tasksIdsCreated: string[];
  };
};
export type UserVerification = {
  joinedAt: string;
  verifEmailsAmount: number;
  lastVerifEmailAt: string | undefined;
};

export type User = {
  id: string | null | undefined;
  displayName: string | null | undefined;
  email: string | null | undefined;
  userData: UserData;
  verificationInfo: UserVerification;
};

export type AuthUser = Omit<User, "projectsIds" | "tasksIds" | "joinedAt">;

export type UserFieldUpdate = { fieldPath: string; value: any };
