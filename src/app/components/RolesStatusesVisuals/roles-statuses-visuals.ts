import { BasicInputsTypes } from "@@components/forms";
import { SelectOption } from "@@components/forms/components/basic-inputs/types";
import { Flatten } from "src/app/types/common";

/* ### Projects ### */
const projectRoleShortNames = [
  "manager",
  "product_owner",
  "vice_manager",
  "team_leader",
  "analyst",
  "designer",
  "intern",
  "coworker",
  "tester",
  "ui_designer",
  "developer",
  "spectator",
  "CUSTOM_ROLE",
] as const;

const projectRoleFullNames = [
  "Project Manager",
  "Product Owner",
  "Vice Manager",
  "Team Leader",
  "Analyst",
  "Designer",
  "Intern",
  "Coworker",
  "Tester",
  "UI/UX Designer",
  "Developer",
  "Spectator",
  "[Custom Role]",
] as const;

export type ProjectRoleShortName = (typeof projectRoleShortNames)[number];
type ProjectRoleFullName = (typeof projectRoleFullNames)[number];
type ProjectRoleStyleClasses = [`icon-role-${ProjectRoleShortName}`, `profile-role-${ProjectRoleShortName}`];

const customRolePrefix = "project#";

export type ProjectRole = {
  shortName: ProjectRoleShortName;
  fullName: ProjectRoleFullName;
  customRole: string | undefined;
  styleClasses: ProjectRoleStyleClasses;
};

export const PROJECT_ROLES: ProjectRole[] = projectRoleFullNames.map((fullName, i) => ({
  shortName: projectRoleShortNames[i],
  fullName,
  customRole: fullName === "[Custom Role]" ? customRolePrefix : undefined,
  styleClasses: [`icon-role-${projectRoleShortNames[i]}`, `profile-role-${projectRoleShortNames[i]}`],
}));

export const PROJECT_ROLES_OPTIONS: SelectOption<ProjectRoleShortName>[] = PROJECT_ROLES.map((role: ProjectRole) => {
  let option: SelectOption<ProjectRoleShortName> = {
    value: role.shortName,
    label: role.fullName,
    iconClass: role.styleClasses[0],
  };

  if (role.fullName === "[Custom Role]") {
    option = {
      ...option,
      prefix: customRolePrefix,
      customWrite: true,
    };
  }

  return option;
});

export const getProjectRoleDetails = (value: ProjectRoleShortName | undefined): ProjectRole | undefined => {
  if (!value) {
    return undefined;
  }
  return PROJECT_ROLES[projectRoleShortNames.findIndex((s: ProjectRoleShortName) => s === value)];
};

/* ### Tasks ### */
const taskStatusShortNames = ["new", "progress", "review", "tests", "done", "blocked", "cancelled"] as const;
const taskStatusFullNames = ["New", "In progress", "In review", "In tests", "Done", "Blocked", "Cancelled"] as const;

export type TaskStatusShortName = (typeof taskStatusShortNames)[number];
type TaskStatusFullName = (typeof taskStatusFullNames)[number];
type TaskStatusStyleClasses = [`status-${TaskStatusShortName}`];

export type TaskStatus = {
  shortName: TaskStatusShortName;
  fullName: TaskStatusFullName;
  styleClasses: TaskStatusStyleClasses;
};
export const TASK_STATUSES: TaskStatus[] = taskStatusFullNames.map((fullName, i) => ({
  shortName: taskStatusShortNames[i],
  fullName,
  styleClasses: [`status-${taskStatusShortNames[i]}`],
}));

export const TASK_STATUSES_OPTIONS: SelectOption<TaskStatusShortName>[] = TASK_STATUSES.map((status: TaskStatus) => ({
  value: status.shortName,
  label: status.fullName,
  iconClass: status.styleClasses[0],
}));

export const getTaskStatusDetails = (value: TaskStatusShortName): TaskStatus =>
  TASK_STATUSES[taskStatusShortNames.findIndex((s: TaskStatusShortName) => s === value)];

export const STATUS_GROUP_NAMES = ["new", "working", "checking", "done"] as const;
export type StatusGroupName = (typeof STATUS_GROUP_NAMES)[number];
export type StatusGroup = { name: StatusGroupName; statuses: TaskStatusShortName[] };
export const TASK_STATUSES_GROUPS: Record<StatusGroupName, StatusGroup> = {
  new: { name: "new", statuses: ["new"] },
  working: { name: "working", statuses: ["progress", "blocked"] },
  checking: { name: "checking", statuses: ["review", "tests"] },
  done: { name: "done", statuses: ["done", "cancelled"] },
};

export const checkIfStatusInGroup = (status: TaskStatusShortName, group: StatusGroupName) =>
  TASK_STATUSES_GROUPS[group].statuses.includes(status);

const taskListTypes = ["backlog", "schedule", "archive"] as const;
export type TaskListType = (typeof taskListTypes)[number];

export const TASK_LISTS_OPTIONS: SelectOption<TaskListType>[] = taskListTypes.map((list) => ({
  label: list.toUpperCase(),
  value: list,
}));
