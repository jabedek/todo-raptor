import { useEffect, useState, useLayoutEffect } from "react";
import { DragDropContext, DropResult, Droppable, DroppableProvided, DroppableStateSnapshot } from "react-beautiful-dnd";

import { ProjectWithAssigneesRegistry, SimpleTask, FullTask, ScheduleColumns } from "@@types";
import { TaskCard } from "@@components/Projects";
import { STATUS_GROUP_NAMES, StatusGroupName, getTaskStatusDetails } from "@@components/Tasks/visuals/task-visuals";
import { ProjectsAPI, TasksAPI } from "@@api/firebase";
import { FullColumn, FullProjectAssignee, Project, Schedule, SimpleColumn } from "src/app/types/Projects";
import { Unsubscribe } from "firebase/auth";
import { transformColumnTo } from "@@components/Projects/projects-utils";
import { FullTasksRegistry } from "src/app/types/Tasks";

type Props = {
  project: ProjectWithAssigneesRegistry | undefined;
  popupTaskForm: (task?: SimpleTask) => void;
};

let UNSUB_TASKS_SCHEDULE: Unsubscribe | undefined = undefined;

const ProjectSchedule: React.FC<Props> = ({ project, popupTaskForm }) => {
  const [draggingDisabledId, setdraggingDisabledId] = useState<string>();
  const [simpleSchedule, setsimpleSchedule] = useState<Schedule<SimpleColumn>>();
  const [fullTasks, setfullTasks] = useState<FullTasksRegistry>();
  const [assignees, setassignees] = useState<Record<string, FullProjectAssignee>>({});

  useEffect(() => {
    if (project) {
      ProjectsAPI.getProjectFullAssignees(project).then((fullAssignees: Record<string, FullProjectAssignee>) => {
        if (fullAssignees) {
          setassignees(fullAssignees);
          unsubListener("tasks_schedule");

          ProjectsAPI.listenScheduleColumns(
            project,
            async (simpleSchedule: Schedule<SimpleColumn> | undefined, unsubSchedule) => {
              UNSUB_TASKS_SCHEDULE = unsubSchedule;

              setsimpleSchedule(simpleSchedule);
            }
          );
        }
      });
    }
  }, [project]);

  useEffect(() => {
    if (simpleSchedule && assignees) {
      ProjectsAPI.getScheduleColumnsTasks(simpleSchedule, assignees).then((fullSchedule: Schedule<FullColumn<FullTask>>) => {
        const columnsTasks: FullTasksRegistry = {};

        Object.values(fullSchedule.columns).forEach((column) => {
          column.tasks.forEach((task) => (columnsTasks[task.id] = task));
        });

        setfullTasks(columnsTasks);
      });
    }
  }, [simpleSchedule?.columns]);

  const unsubListener = (name: "tasks_schedule") => {
    if (["tasks_schedule", "all"].includes(name) && UNSUB_TASKS_SCHEDULE) {
      UNSUB_TASKS_SCHEDULE();
      UNSUB_TASKS_SCHEDULE = undefined;
    }
  };

  const onDragEnd = (result: DropResult, simpleSchedule: Schedule<SimpleColumn> | undefined) => {
    if (project && simpleSchedule && fullTasks) {
      if (!result.destination) return;
      const { source, destination, draggableId } = result;
      setdraggingDisabledId(draggableId);
      const sourceColumn: SimpleColumn = { ...simpleSchedule.columns[source.droppableId] };
      const destColumn: SimpleColumn = { ...simpleSchedule.columns[destination.droppableId] };
      const taskDetails: FullTask | undefined = fullTasks[draggableId];

      if (sourceColumn && destColumn && taskDetails) {
        fullTasks[draggableId].status = destColumn.statuses[0];
        fullTasks[draggableId].statusDetails = getTaskStatusDetails(destColumn.statuses[0]);

        const { assigneeDetails, ...simpleTask } = fullTasks[draggableId];
        // console.log(taskDetails.statusDetails.shortName, "==>", simpleTask.statusDetails.shortName);

        let updatedColumns: ScheduleColumns<SimpleColumn> = { ...simpleSchedule.columns };
        if (source.droppableId !== destination.droppableId) {
          const sourceItems = [...sourceColumn.tasksIdsOrdered];
          const destItems = [...destColumn.tasksIdsOrdered];
          const [removed] = sourceItems.splice(source.index, 1);
          destItems.splice(destination.index, 0, removed);
          updatedColumns[sourceColumn.id].tasksIdsOrdered = sourceItems;
          updatedColumns[destColumn.id].tasksIdsOrdered = destItems;
        } else {
          const copiedItems = [...sourceColumn.tasksIdsOrdered];
          const [removed] = copiedItems.splice(source.index, 1);
          copiedItems.splice(destination.index, 0, removed);
          updatedColumns[sourceColumn.id].tasksIdsOrdered = copiedItems;
        }

        handleChange({ ...simpleSchedule, columns: { ...updatedColumns } }, simpleTask);
      }
    }
  };

  const handleChange = (schedule: Schedule<SimpleColumn>, taskToUpdate: SimpleTask) => {
    const { id, projectId, columns } = schedule;

    const scheduleToUpdate: Schedule<SimpleColumn> = {
      id,
      projectId,
      columns: {
        a_new: transformColumnTo("simple", columns.a_new),
        b_working: transformColumnTo("simple", columns.b_working),
        c_checking: transformColumnTo("simple", columns.c_checking),
        d_done: transformColumnTo("simple", columns.d_done),
      },
    };

    // setsimpleSchedule(scheduleToUpdate);

    TasksAPI.updateTask(taskToUpdate).then(() => {
      ProjectsAPI.updateSchedule(scheduleToUpdate)
        .then(() => {})
        .finally(() => {
          setdraggingDisabledId(undefined);
        });
    });
  };

  return (
    <>
      {fullTasks && simpleSchedule && (
        <DragDropContext onDragEnd={(result: DropResult) => onDragEnd(result, simpleSchedule)}>
          <div className="flex flex-col h-[458px]">
            <div className="flex w-full h-[45px]">
              {STATUS_GROUP_NAMES.map((name) => simpleSchedule.columns[name]).map((column, index) => (
                <div
                  className="flex flex-col w-[25%] h-[45px] border-l border-solid border-l-neutral-200 "
                  key={index}>
                  <div className="text-center text-[11px] p-1 font-bold uppercase app_flex_center bg-[#CACACA] min-h-[45px]">
                    {column.statuses.join(" / ")}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex w-full min-h-[455px] max-h-[455px] ">
              {STATUS_GROUP_NAMES.map((name) => simpleSchedule.columns[name]).map((column, index) => (
                <Droppable
                  isDropDisabled={!!draggingDisabledId}
                  key={column.id}
                  droppableId={column.id}>
                  {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                    <div
                      className="flex flex-col w-[25%] h-full overflow-x-hidden overflow-y-scroll bg-neutral-200  border-l border-solid border-l-neutral-200 "
                      key={index}
                      ref={provided.innerRef}
                      {...provided.droppableProps}>
                      {column.tasksIdsOrdered.map((item, index) => {
                        const taskDetails = fullTasks[item];
                        return (
                          taskDetails && (
                            <TaskCard
                              draggingDisabled={taskDetails.id === draggingDisabledId}
                              key={index}
                              task={taskDetails}
                              index={index}
                              popupTaskForm={() => popupTaskForm(taskDetails)}
                            />
                          )
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </div>
        </DragDropContext>
      )}
    </>
  );
};

export default ProjectSchedule;
