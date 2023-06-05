import { useEffect, useState } from "react";

import { Icons } from "@@components/Layout";
import { getUserDisplayName } from "@@components/Projects";
import { FullTask, FullTasksRegistry, ProjectWithAssigneesRegistry, SimpleTask } from "@@types";
import { getShortId } from "@@utils/id";

type Props = {
  project: ProjectWithAssigneesRegistry | undefined;
  tasks: FullTask[];
  popupTaskForm: (task?: SimpleTask) => void;
};

export const ProjectBacklog: React.FC<Props> = ({ project, tasks, popupTaskForm }) => {
  const [fullTasksRegistry, setfullTasksRegistry] = useState<FullTasksRegistry>();
  useEffect(() => {
    const registry: FullTasksRegistry = {};
    tasks.forEach((t) => {
      registry[t.id] = { ...t };
    });

    setfullTasksRegistry(registry);
  }, [project, tasks]);

  const popup = (task: FullTask): void => {
    const { assigneeDetails, statusDetails, ...simpleTask } = task;
    popupTaskForm(simpleTask);
  };

  return (
    <div className="task-card flex w-full h-full">
      <div className="flex flex-col w-full h-full">
        {fullTasksRegistry &&
          project?.tasksLists.backlog.map(
            (task) =>
              fullTasksRegistry[task] && (
                <div
                  className="flex items-center align-center justify-between p-3  h-[50px] w-full  border border-solid border-b-gray-300"
                  key={fullTasksRegistry[task].id}>
                  <div
                    className={` ${fullTasksRegistry[task].statusDetails.styleClasses[0]} ml-[1px] text-[13px] min-w-[100px] max-w-[140px]`}>
                    {fullTasksRegistry[task].statusDetails.fullName}
                  </div>
                  <div className={` w-[300px] flex items-center text-[13px] app_ellipsis X_inline`}>
                    <div className="pr-[5px] w-[96px] text-[9px]  text-gray-500 font-app_mono ">
                      {getShortId(fullTasksRegistry[task].id)} #{fullTasksRegistry[task].taskNumber}
                    </div>
                    <span className="font-extrabold">{fullTasksRegistry[task].title}</span>
                  </div>

                  <div className={`flex items-center align-center min-w-[200px] max-w-[500px]  `}>
                    {fullTasksRegistry[task].assigneeDetails && (
                      <div
                        className={`ml-4 text-[13px] ${fullTasksRegistry[task].assigneeDetails?.roleDetails?.styleClasses[0]}`}>
                        <p>
                          {fullTasksRegistry[task].assigneeDetails?.email} (
                          {getUserDisplayName({
                            email: project.assigneesRegistry[fullTasksRegistry[task].assigneeId].email,
                            names: project.assigneesRegistry[fullTasksRegistry[task].assigneeId].names,
                          })}
                          )
                        </p>
                        <p className="text-[11px] font-bold">{fullTasksRegistry[task].assigneeDetails?.role}</p>
                      </div>
                    )}
                  </div>
                  {!project?.archived && (
                    <div
                      className="action-wrapper h-[26px] w-[26px] app_flex_center rounded-[3px] bg-white hover:bg-slate-100 group transition-all transition-200 cursor-pointer "
                      onClick={() => popup(fullTasksRegistry[task])}>
                      <Icons.MdReadMore className="h-[16px] w-[16px] font-[300] text-gray-500 group-hover:text-blue-700" />
                    </div>
                  )}
                </div>
              )
          )}
      </div>
    </div>
  );
};
