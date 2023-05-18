import { Flatten, VisualElements } from "./common";

export type User = {
  authentication: Flatten<AuthenticationDetails>;
  contacts: Flatten<ContactsDetails>;
  personal: Flatten<PersonalDetails>;
  work: Flatten<WorkDetails>;
};

export type AuthenticationDetails = {
  id: string;
  email: string;
  verifEmailsAmount: number;
  lastVerifEmailAt: string;
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
