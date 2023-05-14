import { FirebaseApp, FirebaseAuth, FirebaseDB } from "./firebase-config";
import * as APITypes from "./types";
import { AuthAPI } from "./handlers/authAPI";
import { ProjectsAPI, ProjectsRef } from "./handlers/projectsAPI";
import { TasksAPI } from "./handlers/tasksAPI";
import { UsersAPI } from "./handlers/usersAPI";
import { ContactsAPI } from "./handlers/contactsAPI";

export { FirebaseApp, FirebaseAuth, FirebaseDB, APITypes, AuthAPI, ProjectsAPI, ProjectsRef, TasksAPI, UsersAPI, ContactsAPI };
