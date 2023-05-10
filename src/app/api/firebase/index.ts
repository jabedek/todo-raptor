import { AuthAPI } from "./handlers/authAPI";
import { ProjectsAPI, ProjectsRef } from "./handlers/projectsAPI";
import { TasksAPI } from "./handlers/tasksAPI";
import { UsersAPI } from "./handlers/usersAPI";
import { InvitationsAPI } from "./handlers/invitationsAPI";
import * as APITypes from "./types";
import { FirebaseApp, FirebaseAuth, FirebaseDB } from "./firebase-config";

export { AuthAPI, ProjectsAPI, ProjectsRef, TasksAPI, UsersAPI, InvitationsAPI, APITypes, FirebaseApp, FirebaseAuth, FirebaseDB };
