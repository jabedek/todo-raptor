import { User as FirebaseAuthUser } from "firebase/auth";
export type FirebaseUserStateChange = {
  auth: FirebaseAuthUser;
  cause: "auth" | "idToken";
};
