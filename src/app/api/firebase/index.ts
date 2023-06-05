import { ListenersHandler } from "./listeners-handler";
import { FirebaseApp, FirebaseAuth, FirebaseDB } from "./firebase-config";
import { ProjectsRef } from "./handlers/projectsAPI";
import { AuthAPI } from "./handlers/authAPI";
import { UsersAPI } from "./handlers/usersAPI";
import { MetadataAPI } from "./handlers/metadataAPI";

import { ProjectsAPI } from "./handlers/projectsAPI";
import { TasksAPI } from "./handlers/tasksAPI";
import { ContactsAPI } from "./handlers/contactsAPI";

import { AppAPICode, FirebaseUserStateChange, AppAPICodes, AppAPINoCodeEmail, AppAPINoCodeEmails, ListenerCb } from "./types";

import { handlePromiseError, isCodeValid, isNoCodeEmailValid } from "./utils";

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
  //
  ListenersHandler,
  //
  handlePromiseError,
  isCodeValid,
  isNoCodeEmailValid,
};

export type { AppAPICode, FirebaseUserStateChange, AppAPICodes, AppAPINoCodeEmail, AppAPINoCodeEmails, ListenerCb };
