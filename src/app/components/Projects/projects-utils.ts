import { STATUS_GROUP_NAMES, TASK_STATUSES_GROUPS } from "@@components/Tasks/visuals/task-visuals";
import { SimpleTask, FullTask } from "@@types";
import { ScheduleColumnType, SimpleColumn, FullColumn, ScheduleColumns } from "src/app/types/Schedule";
import { PersonalDetails } from "src/app/types/Users";

export const getUserDisplayName = (user: { email: string } & Partial<Pick<PersonalDetails, "names">>) => {
  let display = "";
  const { email } = user;

  if (user.names) {
    const { name, lastname, nickname } = user.names;
    if (nickname.length > 1) {
      display = nickname.substring(0, 2).toUpperCase();
    } else if (name && lastname) {
      display = `${name[0]}${lastname[0]}`;
    }
  }

  if (!display) {
    display = email.substring(0, 2).toUpperCase();
  }
  return display;
};

export const getScheduleColumnsEmpty = (type: "simple" | "full"): ScheduleColumns<ScheduleColumnType> => {
  const statusesGroups = Object.values(TASK_STATUSES_GROUPS);
  const newFullColumns = {
    a_new: {},
    b_working: {},
    c_checking: {},
    d_done: {},
  } as ScheduleColumns<ScheduleColumnType>;

  STATUS_GROUP_NAMES.forEach((name, i) => {
    newFullColumns[name] = {
      id: name,
      statuses: statusesGroups[i].statuses,
      tasksIdsOrdered: [],
    } as SimpleColumn;

    if (type === "full") {
      newFullColumns[name] = {
        ...newFullColumns[name],
        tasks: [],
      } as FullColumn<SimpleTask>;
    }
  });

  return newFullColumns;
};

export const transformColumnTo = (
  target: "simple" | "full",
  sourceColumn: ScheduleColumnType,
  targetTasks: FullTask[] = []
): ScheduleColumnType => {
  let column = {
    id: sourceColumn.id,
    statuses: sourceColumn.statuses,
    tasksIdsOrdered: sourceColumn.tasksIdsOrdered,
  } as SimpleColumn;

  if (target === "full") {
    column = { ...column, tasks: [...targetTasks] } as FullColumn<FullTask>;
  }

  return column;
};
