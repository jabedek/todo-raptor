import { AppAPICode, AppAPINoCodeEmail } from "./types";

export const isCodeValid = (data: AppAPICode) => {
  if (!data) {
    return false;
  }

  const { isoEnd, isoStart } = data;
  const today = new Date(new Date().toISOString());
  return !!(today <= new Date(isoEnd) && today >= new Date(isoStart));
};

export const isNoCodeEmailValid = (data: AppAPINoCodeEmail) => {
  if (!data) {
    return false;
  }

  const { noCheckUntil } = data;
  const today = new Date(new Date().toISOString());

  return !!(today <= new Date(noCheckUntil));
};
