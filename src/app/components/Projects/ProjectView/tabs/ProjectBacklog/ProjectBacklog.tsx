import { usePopupContext } from "@@components/Layout";
import { ReactIcons } from "@@components/Layout/preloaded-icons";
import { ROLES_COLORS } from "@@components/Projects/project-roles";
import { TaskForm } from "@@components/Tasks";
import { TaskStatusDetails } from "@@components/Tasks/TaskStatus/utils/task-statuses";
import { ProjectTypes, TaskTypes } from "@@types";
import { TaskWithDetails } from "src/app/types/Tasks";

type Props = {
  project: ProjectTypes.Project | undefined;
  tasks: TaskWithDetails[];
};

const ProjectBacklog: React.FC<Props> = (props) => {
  const { showPopup } = usePopupContext();

  const popupTaskForm = (task: TaskTypes.Task) =>
    showPopup(
      <TaskForm
        project={props.project}
        task={task}
      />
    );

  return (
    <div className="flex w-full h-full">
      <div className="flex flex-col w-full h-full">
        {props.tasks.map((t) => (
          <div
            className="flex items-center align-center justify-between p-3  h-[50px] w-full  border border-solid border-b-gray-300"
            key={t.id}>
            <div className={` ${t.statusDetails.iconClass} ml-[1px] text-[13px] min-w-[100px] max-w-[140px]`}>
              {t.statusDetails.label}
            </div>
            <div className={` w-[300px]  text-[13px] app_ellipsis X_inline`}>
              <span className="pr-[5px] italic text-gray-500 font-app_mono ">#{t.taskNumber || "X"}</span>
              <span className="font-extrabold">{t.title}</span>
            </div>

            <div className={`flex items-center align-center min-w-[200px] max-w-[500px]  `}>
              <div className={`ml-4 text-[13px] ${t.assigneeDetails?.roleColor2}`}>
                <p>{t.assigneeDetails?.email}</p>
                <p className="text-[11px] font-bold">{t.assigneeDetails?.role}</p>
              </div>
            </div>

            <div
              className="action-wrapper h-[26px] w-[26px] app_flex_center rounded-[3px] bg-white hover:bg-slate-100 group transition-all transition-200 cursor-pointer "
              onClick={() => popupTaskForm(t)}>
              <ReactIcons.MdReadMore className="h-[16px] w-[16px] font-[300] text-gray-500 group-hover:text-blue-700" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectBacklog;
