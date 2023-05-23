import { StatusGroupName, TaskStatusShortName } from "@@components/Tasks/visuals/task-visuals";
import { SimpleTask, FullTask } from "./Tasks";
import { Flatten } from "frotsi";

export type Schedule<S extends ScheduleColumnType> = {
  id: string;
  projectId: string;
  columns: ScheduleColumns<S>;
};

export type SimpleColumn = {
  id: StatusGroupName;
  statuses: TaskStatusShortName[];
  tasksIdsOrdered: string[];
};

export type ScheduleColumnType = SimpleColumn | FullColumn<TaskType>;
type TaskType = SimpleTask | FullTask;

export type FullColumn<T extends TaskType> = Flatten<SimpleColumn & { tasks: T[] }>;

export type ScheduleColumns<ScheduleColumnType> = {
  a_new: ScheduleColumnType;
  b_working: ScheduleColumnType;
  c_checking: ScheduleColumnType;
  d_done: ScheduleColumnType;
};

export type ScheduleAction = { oldColumn: string; column: string; action: "add-to-schedule" | "move" | "remove-from-schedule" };
