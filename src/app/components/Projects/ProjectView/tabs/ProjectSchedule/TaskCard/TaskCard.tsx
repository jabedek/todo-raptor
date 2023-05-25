import { Draggable, DraggableProvided, DraggableRubric, DraggableStateSnapshot } from "react-beautiful-dnd";
import { AssigneeIcon } from "@@components/Projects";
import { FullTask } from "@@types";
import { Icons } from "@@components/Layout";
import { CallbackFn } from "frotsi";
import { getShortId } from "@@components/Tasks/task-utils";
import { ProjectBlockade } from "@@components/Projects/ProjectView/ProjectView";

type Props = {
  task: FullTask;
  index: number;
  blockadeReason: ProjectBlockade;
  popupTaskForm: CallbackFn;
};

const TaskCard: React.FC<Props> = ({ task, index, popupTaskForm, blockadeReason }) => {
  return (
    <Draggable
      isDragDisabled={!!blockadeReason}
      key={task.id}
      draggableId={task.id}
      index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot, rubric: DraggableRubric) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-card transition-all duration-200 ${snapshot.isDragging ? "dragging" : ""} 
          ${blockadeReason ? "bg-emerald-100 border-emerald-100" : " "} ${blockadeReason} 
          ${
            blockadeReason
              ? ""
              : "active:bg-app_light  active:border-app_tertiary  active:select-active-option active:drop-shadow-xl"
          }
          py-2 select-none flex flex-col items-center align-center justify-between p-2 transition-all duration-200 h-[100px] w-full bg-neutral-100 hover:bg-app_light border border-solid border-transparent border-b border-b-solid border-b-neutral-300`}
          key={task.id}>
          <div className={` ${task.statusDetails.styleClasses[0]} mx-[0px]  w-full h-[20px] text-[13px] flex justify-between`}>
            <p>{task.statusDetails.fullName}</p>

            <div className={`flex items-center align-center h-full  min-w-[30px]  pl-2 `}>
              <AssigneeIcon assignee={task.assigneeDetails} />
            </div>
          </div>
          <div className={` w-full flex h-[18px]  my-2 text-[12px] align-center items-center justify-between font-extrabold `}>
            <span className="h-[18px] app_ellipsis_inline w-full">{task.title}</span>
          </div>

          <div className="flex w-full justify-between  h-[26px]">
            <p className=" w-[96px] text-[9px]  text-gray-500 font-app_mono flex items-end">
              {getShortId(task.id)} #{task.taskNumber}
            </p>
            {blockadeReason !== "block block-archived" && (
              <div
                className="action-wrapper min-h-[26px] min-w-[26px] app_flex_center rounded-[3px] bg-white hover:bg-slate-100 group transition-all transition-200 cursor-pointer "
                onClick={popupTaskForm}>
                <Icons.MdReadMore className="min-h-[16px] min-w-[16px] font-[300] text-gray-500 group-hover:text-blue-700" />
              </div>
            )}
          </div>

          {/* <p className="text-[10px] break-all">{task.id}</p> */}
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
