import { VisualElements } from "./common";

export type User = {
  authentication: AuthenticationDetails;
  contacts: ContactsDetails;
  personal: PersonalDetails;
  work: WorkDetails;
};

export type AuthenticationDetails = {
  id: string;
  email: string | null | undefined;
  verifEmailsAmount: number;
  lastVerifEmailAt: string | undefined;
  token?: string;
};

export type ContactsDetails = {
  contactsIds: string[];
  invitationsIds: string[];
};

export type PersonalDetails = {
  names: {
    name: string;
    lastname: string;
    nickname: string;
  };

  visuals: VisualElements;
};

export type WorkDetails = {
  projectsIds: string[];
  tasksIds: string[];
};

export type UserFieldUpdate = { fieldPath: string; value: any };
