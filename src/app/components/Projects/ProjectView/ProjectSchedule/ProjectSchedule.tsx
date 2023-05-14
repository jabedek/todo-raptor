import { TaskTypes } from "@@types";
import { useEffect, useState } from "react";
import { ScheduleColumn } from "../project-types";
import { generateDocumentId, loop } from "frotsi";
import { TaskProgressStatus } from "@@components/Tasks/TaskStatus/utils/task-statuses";

type Props = {
  tasks: TaskTypes.Task[];
};

const statusesNew: TaskProgressStatus[] = ["new"];
const statusesWorking: TaskProgressStatus[] = ["progress", "blocked"];
const statusesFinishing: TaskProgressStatus[] = ["review", "tests"];
const statusesDone: TaskProgressStatus[] = ["done", "cancelled"];
const statuses: TaskProgressStatus[][] = [statusesNew, statusesWorking, statusesFinishing, statusesDone];

const ProjectSchedule: React.FC<Props> = (props) => {
  const [columns, setcolumns] = useState<ScheduleColumn[]>([]);

  useEffect(() => {
    let newColumns: ScheduleColumn[] = [];
    loop(4).forEach((i) => {
      newColumns.push({ tempId: `${i}-${generateDocumentId()}`, currentPosition: i, allowedStatuses: statuses[i], tasks: [] });
    });

    setcolumns(newColumns);
    console.log(newColumns);
  }, []);

  useEffect(() => {
    // const newColumns =
  }, [props.tasks]);

  return (
    <>
      <div className="">
        <div className="flex w-full">
          {columns.map((column, index) => (
            <div
              className="flex w-[25%] border-r border-r-slate-300"
              key={index}>
              index
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProjectSchedule;
