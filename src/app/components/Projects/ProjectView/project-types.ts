import { TaskProgressStatus } from "@@components/Tasks/TaskStatus/utils/task-statuses";
import { TaskTypes } from "@@types";

export type ScheduleStatusesGroup = "new" | "working" | "analysing" | "done";

export type ScheduleColumn = {
  tempId: string;
  currentPosition: number;
  allowedStatuses: TaskProgressStatus[];
  statusesGroup: ScheduleStatusesGroup;
  tasks: TaskTypes.Task[];
};
