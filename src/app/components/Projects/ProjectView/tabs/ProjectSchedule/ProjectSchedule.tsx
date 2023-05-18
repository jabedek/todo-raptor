import { ProjectTypes, TaskTypes } from "@@types";
import { useEffect, useState } from "react";
import { ScheduleColumn, ScheduleStatusesGroup } from "../../project-types";
import { generateDocumentId, loop } from "frotsi";
import { TaskProgressStatus } from "@@components/Tasks/TaskStatus/utils/task-statuses";

type Props = {
  tasks: TaskTypes.Task[];
};

const statusesNew: TaskProgressStatus[] = ["new"];
const statusesWorking: TaskProgressStatus[] = ["progress", "blocked"];
const statusesAnalysing: TaskProgressStatus[] = ["review", "tests"];
const statusesDone: TaskProgressStatus[] = ["done", "cancelled"];
const statuses: TaskProgressStatus[][] = [statusesNew, statusesWorking, statusesAnalysing, statusesDone];
const statusesGroup: ScheduleStatusesGroup[] = ["new", "working", "analysing", "done"];

const ProjectSchedule: React.FC<Props> = (props) => {
  const [columns, setcolumns] = useState<ScheduleColumn[]>([]);
  const [tasks, settasks] = useState<Record<ScheduleStatusesGroup, TaskTypes.Task[]>>({
    new: [],
    working: [],
    analysing: [],
    done: [],
  });

  useEffect(() => {
    let newColumns: ScheduleColumn[] = [];
    loop(4).forEach((i) => {
      newColumns.push({
        tempId: `${i}-${generateDocumentId()}`,
        currentPosition: i,
        allowedStatuses: statuses[i],
        statusesGroup: statusesGroup[i],
        tasks: [],
      });
    });

    setcolumns(newColumns);
  }, []);

  useEffect(() => {
    const newTasks: Record<ScheduleStatusesGroup, TaskTypes.Task[]> = { new: [], working: [], analysing: [], done: [] };

    props.tasks.forEach((task) => {
      const status = task.status;
      const list = task.onList;
      if (statusesNew.includes(status)) {
        newTasks.new.push(task);
      }
      if (statusesWorking.includes(status)) {
        newTasks.working.push(task);
      }
      if (statusesAnalysing.includes(status)) {
        newTasks.analysing.push(task);
      }
      if (statusesDone.includes(status)) {
        newTasks.done.push(task);
      }
    });

    settasks(newTasks);
  }, [props.tasks]);

  return (
    <>
      <div className="flex w-full h-full">
        <div className="flex w-full h-full">
          {columns.map((column, index) => (
            <div
              className="flex flex-col w-[25%] h-full border border-solid border-r-gray-300 "
              key={index}>
              {/* Column header */}
              <div className="text-center text-[11px] p-1 font-bold uppercase app_flex_center bg-stone-300 min-h-[45px]">
                {column.allowedStatuses.join(" / ")}
              </div>

              {/* Column content */}
              <div className="flex flex-col overflow-y-scroll min-h-full ">{}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProjectSchedule;
