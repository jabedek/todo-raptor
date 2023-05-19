import { ProjectTypes, TaskTypes } from "@@types";
import { useEffect, useState } from "react";
import { generateDocumentId, loop } from "frotsi";
import {
  STATUS_GROUP_NAMES,
  StatusGroup,
  StatusGroupName,
  TASK_STATUSES_GROUPS,
  checkIfStatusInGroup,
} from "@@components/RolesStatusesVisuals/roles-statuses-visuals";
import TaskCard from "./TaskCard/TaskCard";
import { DragDropContext, DropResult, Droppable, DroppableProvided, DroppableStateSnapshot } from "react-beautiful-dnd";

type Props = {
  project: ProjectTypes.Project | undefined;
  tasks: TaskTypes.TaskWithDetails[];
  assignees: ProjectTypes.ProjectAssigneeFull[];
  popupTaskForm: (task?: TaskTypes.Task) => void;
};

export type ScheduleColumn = {
  id: StatusGroupName;
  statusesGroup: StatusGroup;
  items: TaskTypes.TaskWithDetails[];
};

const getColumns = () => {
  const statusesGroups = Object.values(TASK_STATUSES_GROUPS);
  let columns: Record<string, ScheduleColumn> = {};
  loop(4).forEach((i) => {
    const columnData = {
      id: statusesGroups[i].name,
      statusesGroup: statusesGroups[i],
      items: [],
    };

    columns[columnData.id] = columnData;
  });

  return columns as Record<StatusGroupName, ScheduleColumn>;
};

type ColumnsData = ReturnType<typeof getColumns>;

const ProjectSchedule: React.FC<Props> = ({ project, tasks, assignees, popupTaskForm }) => {
  const [columns, setcolumns] = useState<ColumnsData>(getColumns());

  useEffect(() => {
    const newTasks: Record<StatusGroupName, TaskTypes.TaskWithDetails[]> = { new: [], working: [], checking: [], done: [] };

    tasks.forEach((task) => {
      const status = task.status;
      if (checkIfStatusInGroup(status, "new")) {
        newTasks.new.push(task);
      }
      if (checkIfStatusInGroup(status, "working")) {
        newTasks.working.push(task);
      }
      if (checkIfStatusInGroup(status, "checking")) {
        newTasks.checking.push(task);
      }
      if (checkIfStatusInGroup(status, "done")) {
        newTasks.done.push(task);
      }
    });

    const newColumns = { ...columns };

    STATUS_GROUP_NAMES.forEach((status) => (newColumns[status].items = newTasks[status]));

    console.log(newColumns);
    setcolumns(newColumns);
  }, [tasks]);

  const onDragEnd = (result: DropResult, columns, setColumns) => {
    console.log(result);
    console.log(columns);

    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={(result: DropResult) => onDragEnd(result, columns, setcolumns)}>
        <div className="flex flex-col h-full">
          <div className="flex w-full h-[45px]">
            {Object.entries(columns).map(([columnId, column], index) => (
              <div
                className="flex flex-col w-[25%] h-[45px]  border border-solid border-r-gray-300 "
                key={index}>
                <div className="text-center text-[11px] p-1 font-bold uppercase app_flex_center bg-[#D4D4D4] min-h-[45px]">
                  {column.statusesGroup.statuses.join(" / ")}
                </div>
              </div>
            ))}
          </div>
          <div className="flex w-full h-[calc(100%-45px)]">
            {Object.entries(columns).map(([columnId, column], index) => (
              <Droppable
                key={columnId}
                droppableId={columnId}>
                {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                  <div
                    className="flex flex-col w-[25%] h-full overflow-y-scroll  border border-solid border-r-gray-300 "
                    key={index}
                    ref={provided.innerRef}
                    {...provided.droppableProps}>
                    {column.items.map((item, index) => (
                      <TaskCard
                        key={index + "_" + item.id}
                        task={item}
                        index={index}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </div>
      </DragDropContext>
    </>
  );
};

export default ProjectSchedule;
