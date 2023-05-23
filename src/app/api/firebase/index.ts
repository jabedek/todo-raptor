import { FirebaseApp, FirebaseAuth, FirebaseDB } from "./firebase-config";
import { ProjectsRef } from "./handlers/projectsAPI";
import { AuthAPI } from "./handlers/authAPI";
import { UsersAPI } from "./handlers/usersAPI";
import { MetadataAPI } from "./handlers/metadataAPI";

import { ProjectsAPI } from "./handlers/projectsAPI";
import { TasksAPI } from "./handlers/tasksAPI";
import { ContactsAPI } from "./handlers/contactsAPI";

import { AppAPICode, FirebaseUserStateChange } from "./types";

export {
  FirebaseApp,
  FirebaseAuth,
  FirebaseDB,
  ProjectsRef,
  //
  MetadataAPI,
  //
  AuthAPI,
  UsersAPI,
  //
  ProjectsAPI,
  TasksAPI,
  ContactsAPI,
};

export type { FirebaseUserStateChange, AppAPICode };
