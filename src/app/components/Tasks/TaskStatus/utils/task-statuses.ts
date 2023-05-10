import { SelectOption } from "@@components/forms/components/basic-inputs/types";

const labels = ["New", "In progress", "In review", "In tests", "Done", "Blocked", "Cancelled"] as const;
const names = ["new", "progress", "review", "tests", "done", "blocked", "cancelled"] as const;
const colors = ["#6e92cf", "#0060ff", "#00c9c2", "#d3a900", "#049900", "#ff0000", "#8d8b8b"] as const;

export type TaskProgressStatus = (typeof names)[number];
type TaskStatusColor = (typeof colors)[number];

export const STATUSES = names.reduce((ac, va, index) => {
  ac[va] = colors[index];
  return ac;
}, {}) as Record<TaskProgressStatus, TaskStatusColor>;

export const STATUSES_OPTIONS: SelectOption<TaskProgressStatus>[] = labels.map((label, i) => ({
  label,
  iconClass: `status-${names[i]}`,
  value: names[i],
}));
