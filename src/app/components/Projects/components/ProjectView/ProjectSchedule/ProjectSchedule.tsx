import { useEffect, useState } from "react";
import { DragDropContext, Droppable, DroppableProvided, DroppableStateSnapshot, DropResult } from "react-beautiful-dnd";
import { Unsubscribe } from "firebase/auth";

import {
  FullAssignee,
  Project,
  FullTasksRegistry,
  FullColumn,
  Schedule,
  ScheduleColumns,
  SimpleColumn,
  FullTask,
  FullProject,
  SimpleTask,
  ProjectBlockade,
} from "@@types";
import { ProjectsAPI, TasksAPI, ListenersHandler } from "@@api/firebase";
import { TaskCard, getScheduleColumnsEmpty, transformColumnTo } from "@@components/Projects";
import { getTaskStatusDetails, STATUS_GROUP_NAMES } from "@@components/Tasks";

window["__react-beautiful-dnd-disable-dev-warnings"] = true;

type Props = {
  project: FullProject | undefined;
  popupTaskForm: (task?: SimpleTask) => void;
  blockadeReason: ProjectBlockade;
};

enum ListenerDataName {
  tasks_schedule = "tasks_schedule",
  all = "all",
}

export const ProjectSchedule: React.FC<Props> = ({ project, popupTaskForm, blockadeReason }) => {
  const Listeners = new ListenersHandler("ProjectSchedule");
  const emptyColumns = getScheduleColumnsEmpty("full");
  const [draggingDisabledId, setdraggingDisabledId] = useState<string>();
  const [simpleSchedule, setsimpleSchedule] = useState<Schedule<SimpleColumn>>();
  const [fullTasks, setfullTasks] = useState<FullTasksRegistry>();
  const [assignees, setassignees] = useState<Record<string, FullAssignee>>({});
  const [blockade, setblockade] = useState<ProjectBlockade>();

  useEffect(() => {
    if (project && project.assignees) {
      ProjectsAPI.getProjectFullAssignees(project)
        .then((fullAssignees: Record<string, FullAssignee>) => {
          if (fullAssignees) {
            setassignees(fullAssignees);
            listenScheduleColumns(project);
          }
        })
        .catch((e) => console.error(e));
    }

    return () => Listeners.unsubAll();
  }, [project]);

  useEffect(() => {
    if (simpleSchedule && assignees) {
      ProjectsAPI.getScheduleFullTasks(simpleSchedule, assignees)
        .then((fullSchedule: Schedule<FullColumn<FullTask>>) => {
          const columnsTasks: FullTasksRegistry = {};
          Object.values(fullSchedule.columns).forEach((column) => column.tasks.forEach((task) => (columnsTasks[task.id] = task)));
          setfullTasks(columnsTasks);
        })
        .catch((e) => console.error(e));
    }
  }, [simpleSchedule]);

  useEffect(() => {
    let reason: ProjectBlockade;
    if (draggingDisabledId) {
      reason = "block block-dragging";
    }
    reason = blockadeReason;
    setblockade(reason);
  }, [blockadeReason, draggingDisabledId]);

  const listenScheduleColumns = (projectData: Project): void => {
    ProjectsAPI.listenScheduleColumns(
      projectData,
      async (data: Schedule<SimpleColumn> | undefined, unsubSchedule: Unsubscribe | undefined) => {
        if (data && unsubSchedule) {
          Listeners.sub(ListenerDataName.tasks_schedule, unsubSchedule);
          setsimpleSchedule(data);
        }
      }
    ).catch((e) => console.error(e));
  };

  const onDragEnd = (result: DropResult, simpleSchedule: Schedule<SimpleColumn> | undefined): void => {
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

        const updatedColumns: ScheduleColumns<SimpleColumn> = { ...simpleSchedule.columns };
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

  const handleChange = (schedule: Schedule<SimpleColumn>, taskToUpdate: SimpleTask): void => {
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

    TasksAPI.updateTask(taskToUpdate)
      .then(() => {
        ProjectsAPI.updateSchedule(scheduleToUpdate)
          .then(() => {})
          .finally(() => {
            setdraggingDisabledId(undefined);
          });
      })
      .catch((e) => console.error(e));
  };

  return (
    <>
      <div className="columns-headers flex flex-col h-full">
        <div className="flex w-full h-[45px]">
          {STATUS_GROUP_NAMES.map((name) => emptyColumns[name]).map((column, index) => (
            <div
              className="flex flex-col w-[25%] h-[45px] border-l border-r border-x border-solid border-r-neutral-200 border-l-[#CACACA]"
              key={index}>
              <div className="text-center text-[11px] p-1 font-bold uppercase app_flex_center bg-[#CACACA] min-h-[45px]">
                {column.statuses.join(" / ")}
              </div>
            </div>
          ))}
        </div>
        <div className="columns-content flex w-full min-h-[calc(100%-45px)] max-h-[455px] ">
          {
            <DragDropContext onDragEnd={(result: DropResult) => onDragEnd(result, simpleSchedule)}>
              {STATUS_GROUP_NAMES.map((name) => (simpleSchedule ? simpleSchedule.columns : emptyColumns)[name]).map(
                (column, index) => (
                  <Droppable
                    isDropDisabled={!!draggingDisabledId}
                    key={column.id}
                    droppableId={column.id}>
                    {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                      <div
                        className="flex flex-col w-[25%] h-full overflow-x-hidden overflow-y-scroll bg-neutral-200  border-l border-r border-solid border-r-neutral-200 border-l-transparent "
                        key={index}
                        ref={provided.innerRef}
                        {...provided.droppableProps}>
                        {fullTasks &&
                          column.tasksIdsOrdered.map((item, index) => {
                            const taskDetails = fullTasks[item];
                            return (
                              taskDetails && (
                                <TaskCard
                                  key={index}
                                  task={taskDetails}
                                  index={index}
                                  blockadeReason={blockade}
                                  popupTaskForm={() => popupTaskForm(taskDetails)}
                                />
                              )
                            );
                          })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                )
              )}
            </DragDropContext>
          }
        </div>
      </div>
    </>
  );
};
