import { User as FirebaseAuthUser } from "firebase/auth";
export type FirebaseUserStateChange = {
  auth: FirebaseAuthUser;
  cause: "auth" | "idToken";
};
export type AppAPICode = { isoStart: string; isoEnd: string };

export type AppAPINoCodeEmail = {
  noCheckUntil: string;
};

export type AppAPICodes = Record<string, AppAPICode>;
export type AppAPINoCodeEmails = Record<string, AppAPINoCodeEmail>;
