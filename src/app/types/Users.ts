import { DeepFlatten } from "frotsi/dist/types";

export type User = DeepFlatten<{
  authentication: AuthenticationDetails;
  contacts: ContactsDetails;
  personal: PersonalDetails;
  work: WorkDetails;
}>;

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
};

export type WorkDetails = {
  projectsIds: string[];
  tasksIds: string[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UserFieldUpdate = { fieldPath: string; value: any };
