import { SelectOption } from "@@components/forms";

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

export const STATUS_GROUP_NAMES = ["a_new", "b_working", "c_checking", "d_done"] as const;
export type StatusGroupName = (typeof STATUS_GROUP_NAMES)[number];
export type StatusGroup = { name: StatusGroupName; statuses: TaskStatusShortName[] };
export const TASK_STATUSES_GROUPS: Record<StatusGroupName, StatusGroup> = {
  a_new: { name: "a_new", statuses: ["new"] },
  b_working: { name: "b_working", statuses: ["progress", "blocked"] },
  c_checking: { name: "c_checking", statuses: ["review", "tests"] },
  d_done: { name: "d_done", statuses: ["done", "cancelled"] },
};

export const checkIfStatusInGroup = (status: TaskStatusShortName, group: StatusGroupName) =>
  TASK_STATUSES_GROUPS[group].statuses.includes(status);

export const getStatusGroup = (status: TaskStatusShortName): StatusGroupName => {
  let group: StatusGroupName = "a_new";

  Object.values(TASK_STATUSES_GROUPS).forEach((val, i) => {
    if (val.statuses.includes(status)) {
      group = val.name;
    }
  });

  return group;
};

const taskListTypes = ["backlog", "schedule", "archive"] as const;
export type TaskListType = (typeof taskListTypes)[number];

export const TASK_LISTS_OPTIONS: SelectOption<TaskListType>[] = taskListTypes.map((list) => ({
  label: list.toUpperCase(),
  value: list,
}));
