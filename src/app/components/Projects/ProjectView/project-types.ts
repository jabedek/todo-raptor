import { TaskProgressStatus } from "@@components/Tasks/TaskStatus/utils/task-statuses";
import { TaskTypes } from "@@types";

export type ScheduleColumn = {
  tempId: string;
  currentPosition: number;
  allowedStatuses: TaskProgressStatus[];
  tasks: TaskTypes.Task[];
};
