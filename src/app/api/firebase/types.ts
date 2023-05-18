import { User as FirebaseAuthUser } from "firebase/auth";
export type FirebaseUserStateChange = {
  auth: FirebaseAuthUser;
  cause: "auth" | "idToken";
};
export type AppCode = { id: string; isoStart: string; isoEnd: string };
