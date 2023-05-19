import { Button, RenderObject } from "@@components/common";

// import "../ProjectsTable/ProjectsTable.scss";
import "./ProjectView.scss";
import { ProjectTypes, TaskTypes, UserTypes } from "@@types";
import ProjectViewHeader from "./ProjectViewHeader/ProjectViewHeader";
import SidePanel from "@@components/common/SidePanel";
import { usePopupContext } from "@@components/Layout";
import { useProjectsValue, useUserValue } from "@@contexts";
import { ConfirmDialog, FormClearX } from "@@components/forms";
import { ProjectsAPI, TasksAPI, UsersAPI } from "@@api/firebase";
import { TaskForm } from "@@components/Tasks";
import { useEffect, useState } from "react";
import ProjectSchedule from "./tabs/ProjectSchedule/ProjectSchedule";
import { Unsubscribe } from "firebase/auth";
import ProjectBacklog from "./tabs/ProjectBacklog/ProjectBacklog";
import {
  TaskListType,
  getProjectRoleDetails,
  getTaskStatusDetails,
} from "@@components/RolesStatusesVisuals/roles-statuses-visuals";
import AssignToProjectForm from "./AssignToProjectForm/AssignToProjectForm";
import ProjectAssigneeIcon from "../ProjectAssigneeIcon/ProjectAssigneeIcon";

type Props = {
  projectData: ProjectTypes.Project | undefined;
};

let UNSUB_TASKS: Unsubscribe | undefined = undefined;
let UNSUB_PROJECT: Unsubscribe | undefined = undefined;

type TasksSplitted = {
  schedule: TaskTypes.TaskWithDetails[];
  backlog: TaskTypes.TaskWithDetails[];
  archive: TaskTypes.TaskWithDetails[];
};

const ProjectView: React.FC<Props> = ({ projectData }) => {
  const [tab, settab] = useState<TaskListType>("schedule");
  const [tasks, settasks] = useState<TasksSplitted>({ schedule: [], backlog: [], archive: [] });
  const [project, setproject] = useState<ProjectTypes.Project | undefined>(projectData);
  const { unboundAssignees } = useProjectsValue();
  const [assignees, setassignees] = useState<ProjectTypes.ProjectAssigneeFull[]>([]);
  // schedule - statuses: "New", "In progress" + "Blocked", "In review" + "In tests"
  // backlog - "New", occasionally also "Blocked"
  // archive - "Done", "Cancelled"

  const { user, canUseAPI } = useUserValue();

  const { showPopup } = usePopupContext();

  useEffect(() => {
    unsubListener("project");
    if (projectData && user && canUseAPI) {
      ProjectsAPI.listenToProjectData(projectData.id, (project: ProjectTypes.Project, unsubProject) => {
        setproject(project);
        UNSUB_PROJECT = unsubProject;
        unsubListener("tasks");

        const tasksIds = [...project.tasksIds];
        if (tasksIds?.length) {
          TasksAPI.listenToTasks(tasksIds, (data: TaskTypes.Task[], unsubTasks) => {
            console.log(tasksIds, data);
            UNSUB_TASKS = unsubTasks;
            const assigneesWithDetails: ProjectTypes.ProjectAssigneeFull[] | undefined = project.assignees.map((assignee) => ({
              ...assignee,
              names: unboundAssignees[assignee.id]?.names,
              roleDetails: getProjectRoleDetails(assignee.role),
            }));

            const tasksWithDetails: TaskTypes.TaskWithDetails[] = data.map((task) => ({
              ...task,
              assigneeDetails: assigneesWithDetails.find(({ id }) => id === task.assigneeId),
              statusDetails: getTaskStatusDetails(task.status),
            }));

            setassignees(assigneesWithDetails);

            const tasksSplitted: TasksSplitted = {
              schedule: [],
              backlog: [],
              archive: [],
            };

            tasksWithDetails.forEach((task) => {
              tasksSplitted[task.list.type].push(task);
            });

            settasks(tasksSplitted);
            console.log(tasksSplitted);
          });
        }
      });
    }

    return () => unsubListener("all");
  }, [project?.tasksCounter]);

  const unsubListener = (name: "tasks" | "project" | "all") => {
    if (["tasks", "all"].includes(name) && UNSUB_TASKS) {
      UNSUB_TASKS();
      UNSUB_TASKS = undefined;
    }
    if (["project", "all"].includes(name) && UNSUB_PROJECT) {
      UNSUB_PROJECT();
      UNSUB_PROJECT = undefined;
    }
  };

  const popupAssignToProjectForm = () =>
    showPopup(
      <AssignToProjectForm
        user={user}
        project={project}
      />
    );

  const popupConfirmDialog = (assignee: ProjectTypes.ProjectAssigneeFull) =>
    showPopup(
      <ConfirmDialog
        submitFn={() => removeAssignee(assignee)}
        whatAction="remove assignee from project"
        closeOnSuccess={true}
      />
    );

  const removeAssignee = (assignee: ProjectTypes.ProjectAssigneeFull) => {
    if (project) {
      ProjectsAPI.userAsAssigneeBond(assignee, project, "break")
        .then(() => {})
        .catch((e) => console.error(e));
    }
  };

  const popupTaskForm = (task?: TaskTypes.Task) =>
    showPopup(
      <TaskForm
        project={project}
        task={task}
      />
    );

  return (
    <>
      <div className="flex flex-col rounded-[14px] overflow-hidden">
        <div className="project-view justify-center font-app_primary bg-[rgba(241,241,241,1)] flex ">
          {/* Side - Left */}

          {/* Main */}
          <div className="project-view__main flex flex-col justify-start">
            {/* <RenderObject data={tasks} />
            {tab} */}
            <ProjectViewHeader
              projectTitle={project?.title}
              setTabFn={(tab) => settab(tab)}
              tab={tab}
            />

            <div className={`text-[14px] h-[40px] font-bold w-full text-center py-2 bg-neutral-200`}> {project?.title} </div>
            {tab === "backlog" && (
              <ProjectBacklog
                project={project}
                assignees={assignees}
                tasks={tasks["backlog"]}
                popupTaskForm={popupTaskForm}
              />
            )}
            {tab === "schedule" && (
              <ProjectSchedule
                project={project}
                assignees={assignees}
                tasks={tasks["schedule"]}
                popupTaskForm={popupTaskForm}
              />
            )}
          </div>

          {/* Side - Right */}
          <SidePanel
            widthPx="220"
            heightPxHeader="50"
            heightPxBody="540">
            <div className="h-full project-border border border-l-[1px] app_flex_center">
              <Button
                label="Add assignee"
                clickFn={popupAssignToProjectForm}
                formStyle="primary"
              />
            </div>
            <div className="h-full project-border border border-y-0 ">
              {assignees.map((assignee, i) => (
                <div
                  className="relative flex items-center py-2 border-none border-transparent"
                  key={i}>
                  <ProjectAssigneeIcon
                    assignee={assignee}
                    tailwindStyles="mx-[10px] "
                  />

                  {/* <div
                    key={i + "name"}
                    className={`team-assignee relative font-app_mono mx-[10px] text-[10px] h-[24px] w-[24px] rounded-full ${assignee.roleDetails?.styleClasses[1]} app_flex_center border-2 border-white border-solid
                     `}>
                    <p>{assignee.email?.substring(0, 2).toUpperCase()}</p>
                  </div> */}
                  <p
                    key={assignee.email}
                    className="text-[11px]">
                    {assignee.email}
                  </p>

                  {user?.authentication.id !== assignee.id && (
                    <div className="ml-2">
                      <FormClearX
                        key={i + "x"}
                        clickFn={() => popupConfirmDialog(assignee)}
                        sizeVariant="I"
                        relatedItemId={assignee.id}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </SidePanel>
        </div>

        <div className="w-full h-[100px] flex bg-neutral-200 project-border border app_flex_center ">
          <div className="flex gap-4">
            <Button
              label="Add task"
              clickFn={popupTaskForm}
              formStyle="primary"
            />
            <Button
              label="Edit project"
              clickFn={popupTaskForm}
              formStyle="secondary"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectView;
