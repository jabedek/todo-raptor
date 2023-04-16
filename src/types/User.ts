import { User as FirebaseUser } from "firebase/auth";

export type User = {
  uid: string | null | undefined;
  displayName: string | null | undefined;
  email: string | null | undefined;
  firebaseData: FirebaseUser | undefined;
};
