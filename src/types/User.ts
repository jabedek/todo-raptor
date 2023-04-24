import { VisualElements } from "./common";

export type User = {
  authData: AuthData;
  userData: UserData;
};

export type UserData = {
  workDetails: WorkDetails;
  verificationDetails: VerificationDetails;
  visuals: VisualElements;
};

export type WorkDetails = {
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
export type VerificationDetails = {
  joinedAt: string;
  verifEmailsAmount: number;
  lastVerifEmailAt: string | undefined;
};

export type AuthData = {
  id: string | null | undefined;
  displayName: string | null | undefined;
  email: string | null | undefined;
};

export type UserFieldUpdate = { fieldPath: string; value: any };
