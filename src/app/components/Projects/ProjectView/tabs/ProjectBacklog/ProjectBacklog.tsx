import { Icons } from "@@components/Layout";
import { getUserDisplayName } from "@@components/Projects";
import { getShortId } from "@@components/Tasks/task-utils";
import { Project, FullProjectAssignee, ProjectWithAssigneesRegistry, SimpleTask, FullTask } from "@@types";

type Props = {
  project: ProjectWithAssigneesRegistry | undefined;
  tasks: FullTask[];
  popupTaskForm: (task?: SimpleTask) => void;
};

const ProjectBacklog: React.FC<Props> = ({ project, tasks, popupTaskForm }) => {
  return (
    <div className="task-card flex w-full h-full">
      <div className="flex flex-col w-full h-full">
        {tasks.map((task) => (
          <div
            className="flex items-center align-center justify-between p-3  h-[50px] w-full  border border-solid border-b-gray-300"
            key={task.id}>
            <div className={` ${task.statusDetails.styleClasses[0]} ml-[1px] text-[13px] min-w-[100px] max-w-[140px]`}>
              {task.statusDetails.fullName}
            </div>
            <div className={` w-[300px] flex items-center text-[13px] app_ellipsis X_inline`}>
              <div className="pr-[5px] w-[96px] text-[9px]  text-gray-500 font-app_mono ">
                {getShortId(task.id)} #{task.taskNumber}
              </div>
              <span className="font-extrabold">{task.title}</span>
            </div>

            <div className={`flex items-center align-center min-w-[200px] max-w-[500px]  `}>
              {task.assigneeDetails && (
                <div className={`ml-4 text-[13px] ${task.assigneeDetails?.roleDetails?.styleClasses[0]}`}>
                  <p>
                    {task.assigneeDetails?.email} (
                    {getUserDisplayName({ email: task.assigneeDetails.email, names: task.assigneeDetails.names })})
                  </p>
                  <p className="text-[11px] font-bold">{task.assigneeDetails?.role}</p>
                </div>
              )}
            </div>
            {!project?.archived && (
              <div
                className="action-wrapper h-[26px] w-[26px] app_flex_center rounded-[3px] bg-white hover:bg-slate-100 group transition-all transition-200 cursor-pointer "
                onClick={() => popupTaskForm(task)}>
                <Icons.MdReadMore className="h-[16px] w-[16px] font-[300] text-gray-500 group-hover:text-blue-700" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectBacklog;
