import { AppAPICode, AppAPINoCodeEmail } from "./types";

export const isCodeValid = (data: AppAPICode): boolean => {
  if (!data) {
    return false;
  }

  const { isoEnd, isoStart } = data;
  const today = new Date(new Date().toISOString());
  return !!(today <= new Date(isoEnd) && today >= new Date(isoStart));
};

export const isNoCodeEmailValid = (data: AppAPINoCodeEmail): boolean => {
  if (!data) {
    return false;
  }

  const { noCheckUntil } = data;
  const today = new Date(new Date().toISOString());

  return !!(today <= new Date(noCheckUntil));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handlePromiseError(name: string, e?: unknown): unknown {
  console.error(`Error regarding [${name}]. `, e);

  if (e) {
    return e as unknown;
  } else {
    return "";
  }
}
