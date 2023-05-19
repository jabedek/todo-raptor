import ProjectAssigneeIcon from "@@components/Projects/ProjectAssigneeIcon/ProjectAssigneeIcon";
import { TaskTypes } from "@@types";
import { CallbackFn } from "frotsi";
import { Draggable, DraggableProvided, DraggableRubric, DraggableStateSnapshot } from "react-beautiful-dnd";

type Props = {
  task: TaskTypes.TaskWithDetails;
  index: number;
};

const TaskCard: React.FC<Props> = ({ task, index }) => {
  return (
    <Draggable
      key={task.id}
      draggableId={task.id}
      index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot, rubric: DraggableRubric) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="select-none flex flex-col items-center align-center justify-between p-2  h-[80px] w-full hover:bg-zinc-200 active:bg-zinc-300   border border-solid border-b-gray-300"
          key={task.id}>
          <div className={` ${task.statusDetails.styleClasses[0]} ml-[0px]  w-full h-[20px] text-[13px] flex justify-between`}>
            <p>{task.statusDetails.fullName}</p>
            <div className={`flex items-center align-center h-full  min-w-[30px]   `}>
              <ProjectAssigneeIcon assignee={task.assigneeDetails} />
            </div>
          </div>
          <div className={` w-full flex h-[40px] mt-3 text-[13px] app_ellipsis X_inline`}>
            <span className="pr-[5px] italic text-gray-500 font-app_mono ">#{task.taskNumber || "X"}</span>
            <span className="font-extrabold ">{task.title}</span>
          </div>
        </div>

        // <div
        //   ref={provided.innerRef}
        //   {...provided.draggableProps}
        //   {...provided.dragHandleProps}>
        //   Task
        // </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
