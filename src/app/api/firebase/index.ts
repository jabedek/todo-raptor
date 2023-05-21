import { FirebaseApp, FirebaseAuth, FirebaseDB } from "./firebase-config";
import { ProjectsRef } from "./handlers/projectsAPI";
import { AuthAPI } from "./handlers/authAPI";
import { UsersAPI } from "./handlers/usersAPI";

import { ProjectsAPI } from "./handlers/projectsAPI";
import { TasksAPI } from "./handlers/tasksAPI";
import { ContactsAPI } from "./handlers/contactsAPI";

import { AppCode, FirebaseUserStateChange } from "./types";

export {
  FirebaseApp,
  FirebaseAuth,
  FirebaseDB,
  ProjectsRef,

  //
  AuthAPI,
  UsersAPI,
  //
  ProjectsAPI,
  TasksAPI,
  ContactsAPI,
};

export type { FirebaseUserStateChange, AppCode };
