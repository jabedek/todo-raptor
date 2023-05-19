import { PersonalDetails } from "src/app/types/Users";
import { Flatten } from "src/app/types/common";

export const getUserDisplayName = (user: { email: string } & Partial<Pick<PersonalDetails, "names">>) => {
  let display = "";
  const { email } = user;

  if (user.names) {
    const { name, lastname, nickname } = user.names;
    if (nickname.length > 1) {
      display = nickname.substring(0, 2).toUpperCase();
    } else if (name && lastname) {
      display = `${name[0]}${lastname[0]}`;
    }
  }

  if (!display) {
    display = email.substring(0, 2).toUpperCase();
  }
  return display;
};
