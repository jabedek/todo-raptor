import { FirebaseApp, FirebaseAuth, FirebaseDB } from "./firebase-config";
import * as APITypes from "./types";
import { ProjectsRef } from "./handlers/projectsAPI";
import { AuthAPI } from "./handlers/authAPI";
import { UsersAPI } from "./handlers/usersAPI";

import { ProjectsAPI } from "./handlers/projectsAPI";
import { TasksAPI } from "./handlers/tasksAPI";
import { ContactsAPI } from "./handlers/contactsAPI";

export {
  FirebaseApp,
  FirebaseAuth,
  FirebaseDB,
  ProjectsRef,
  //
  APITypes,
  //
  AuthAPI,
  UsersAPI,
  //
  ProjectsAPI,
  TasksAPI,
  ContactsAPI,
};
