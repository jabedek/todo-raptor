import { Button, RenderObject } from "@@components/common";

// import "../ProjectsTable/ProjectsTable.scss";
import "./ProjectView.scss";
import { ProjectTypes, TaskTypes, UserTypes } from "@@types";
import ProjectViewHeader from "./ProjectViewHeader/ProjectViewHeader";
import SidePanel from "@@components/common/SidePanel";
import { usePopupContext } from "@@components/Layout";
import AddMemberForm from "./AddMemberForm/AddMemberForm";
import { useUserValue } from "@@contexts";
import { ConfirmDialog, FormClearX } from "@@components/forms";
import { ProjectsAPI, TasksAPI } from "@@api/firebase";
import { TaskForm } from "@@components/Tasks";
import { useEffect, useState } from "react";
import ProjectSchedule from "./tabs/ProjectSchedule/ProjectSchedule";
import { Unsubscribe } from "firebase/auth";
import ProjectBacklog from "./tabs/ProjectBacklog/ProjectBacklog";
import { TaskStatusDetails, getDetailsByStatus } from "@@components/Tasks/TaskStatus/utils/task-statuses";
import { TaskWithDetails } from "src/app/types/Tasks";
import { PROJECT_ROLES_OPTIONS } from "../project-roles";

type Props = {
  projectData: ProjectTypes.Project | undefined;
};

let UNSUB_TASKS: Unsubscribe | undefined = undefined;
let UNSUB_PROJECT: Unsubscribe | undefined = undefined;

const ProjectView: React.FC<Props> = ({ projectData }) => {
  const [tab, settab] = useState<TaskTypes.TaskListType>("schedule");
  const [tasks, settasks] = useState<TaskWithDetails[]>([]);
  const [project, setproject] = useState<ProjectTypes.Project | undefined>(projectData);
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
        TasksAPI.listenToProjectTasks(["_", ...project.tasksIds], (data: TaskTypes.Task[], unsubTasks) => {
          UNSUB_TASKS = unsubTasks;

          const dataWithStatusDetails: TaskWithDetails[] = data.map((task) => {
            const assignee = project?.teamMembers.find((m) => m.id === task.assigneeId);
            const assigneeDetails = {
              ...assignee,
              roleColor2: PROJECT_ROLES_OPTIONS.find(({ value }) => value === assignee?.role)?.iconClass,
            };
            const statusDetails = getDetailsByStatus(task.status);
            return { ...task, assigneeDetails, statusDetails } as any;
          });
          settasks(dataWithStatusDetails);
        });
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

  const popupAddMemberForm = () =>
    showPopup(
      <AddMemberForm
        user={user}
        project={project}
      />
    );

  const popupConfirmDialog = (member: ProjectTypes.ProjectTeamMember) =>
    showPopup(
      <ConfirmDialog
        submitFn={() => removeMember(member)}
        whatAction="remove member from project"
        closeOnSuccess={true}
      />
    );

  const removeMember = (member: ProjectTypes.ProjectTeamMember) => {
    if (project) {
      ProjectsAPI.userAsTeamMemberBond(member, project, "break")
        .then(() => {})
        .catch((e) => console.error(e));
    }
  };

  const popupTaskForm = () => showPopup(<TaskForm project={project} />);

  return (
    <>
      <div className="flex flex-col rounded-[14px] overflow-hidden">
        <div className="project-view justify-center font-app_primary bg-[rgba(241,241,241,1)] flex ">
          {/* Side - Left */}

          {/* Main */}
          <div className="project-view__main flex flex-col justify-start">
            <ProjectViewHeader
              projectTitle={project?.title}
              setTabFn={(tab) => settab(tab)}
              tab={tab}
            />

            <div className={`text-[14px] h-[40px] font-bold w-full text-center py-2 bg-neutral-200`}> {project?.title} </div>
            {tab === "backlog" && (
              <ProjectBacklog
                project={project}
                tasks={tasks.filter((t) => t.onList === "backlog")}
              />
            )}
            {tab === "schedule" && <ProjectSchedule tasks={tasks.filter((t) => t.onList === "schedule")} />}
          </div>

          {/* Side - Right */}
          <SidePanel
            widthPx="220"
            heightPxHeader="50"
            heightPxBody="540">
            <div className="h-full project-border border border-l-[1px] app_flex_center">
              <Button
                label="Add member"
                clickFn={popupAddMemberForm}
                formStyle="primary"
              />
            </div>
            <div className="h-full project-border border border-y-0 ">
              {project?.teamMembers.map((m, i) => (
                <div
                  className="relative flex items-center py-2 border-none border-transparent"
                  key={i}>
                  <div
                    key={i + "name"}
                    className={`team-member relative font-app_mono mx-[10px] text-[10px] h-[24px] w-[24px] rounded-full ${m.roleColor} app_flex_center border-2 border-white border-solid
                     `}>
                    <p>{m.email?.substring(0, 2).toUpperCase()}</p>
                  </div>
                  <p
                    key={m.email}
                    className="text-[11px]">
                    {m.email}
                  </p>

                  {user?.authentication.id !== m.id && (
                    <div className="ml-2">
                      <FormClearX
                        key={i + "x"}
                        clickFn={() => popupConfirmDialog(m)}
                        sizeVariant="I"
                        relatedItemId={m.id}
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
