import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Unsubscribe } from "firebase/auth";

import "./ProjectView.scss";
import { FullAssignee, FullTask, Project, ProjectsFullData, ProjectWithAssigneesRegistry, SimpleTask } from "@@types";
import { ProjectsAPI, TasksAPI } from "@@api/firebase";
import { useUserValue } from "@@contexts";
import { Button, SidePanel } from "@@components/common";
import { usePopupContext } from "@@components/Layout";
import { ConfirmDialog, FormClearX } from "@@components/forms";
import { TaskForm } from "@@components/Tasks";
import { AssignToProjectForm, AssigneeIcon, ProjectForm, ProjectViewHeader } from "@@components/Projects";
import ProjectSchedule from "./tabs/ProjectSchedule/ProjectSchedule";
import ProjectBacklog from "./tabs/ProjectBacklog/ProjectBacklog";
import { TaskListType } from "@@components/Tasks/visuals/task-visuals";
import { enrichTasksWithAssignees, getShortId } from "@@components/Tasks/task-utils";
import { useApiAccessValue } from "src/app/contexts/ApiAccessContext";

export type ProjectBlockade =
  | "block block-archived"
  | "block block-cancelled"
  | "block block-completed"
  | "block block-dragging"
  | undefined;

type Props = { projectData: Project | undefined; projectId: string };

let UNSUB_TASKS_OTHER: Unsubscribe | undefined = undefined;
let UNSUB_PROJECT: Unsubscribe | undefined = undefined;

const editingRoles = ["manager", "product-owner"];

const ProjectView: React.FC<Props> = (props) => {
  const [tab, settab] = useState<TaskListType>("schedule");
  const [tasksBacklog, settasksBacklog] = useState<FullTask[]>([]);
  const [project, setproject] = useState<ProjectWithAssigneesRegistry>();
  const { user } = useUserValue();
  const { canAccessAPI } = useApiAccessValue();
  const { showPopup } = usePopupContext();
  const navigate = useNavigate();
  const [currentUserCanEdit, setcurrentUserCanEdit] = useState(false);
  const [blockadeReason, setblockadeReason] = useState<ProjectBlockade>();

  useEffect(() => {
    let reason: ProjectBlockade;

    if (project) {
      if (project.archived) {
        reason = "block block-archived";

        if (project.status == "completed") {
          reason = `block block-${project.status}`;
        }
        if (project.status == "cancelled") {
          reason = `block block-${project.status}`;
        }
      }
    }
    setblockadeReason(reason);
  }, [project?.archived, project?.status]);

  useEffect(() => {
    if (project && user) {
      const assignee = project?.assignees.find((a) => a.id === user?.authentication.id);
      if (assignee) {
        const hasEditingRole = editingRoles.includes(assignee.role);
        setcurrentUserCanEdit(hasEditingRole);
      } else {
        navigate("/projects");
      }
    }
  }, [project, user]);

  useEffect(() => {
    unsubListener("project");
    if (props.projectData !== undefined) {
      if (user && canAccessAPI) {
        const projectData = props.projectData;
        ProjectsAPI.listenProjectsWithAssigneesData(
          [projectData.id],
          true,
          (data: ProjectsFullData | undefined, unsubProject: Unsubscribe | undefined) => {
            if (data && unsubProject) {
              UNSUB_PROJECT = unsubProject;
              const project = projectData?.archived ? data.archived[0] : data.active[0];
              setproject(project);

              if (project && tab === "backlog") {
                // Listen to tasks for Backlog & Archive
                unsubListener("tasks_other");
                TasksAPI.listenToProjectOtherTasks(
                  project,
                  (tasksData: SimpleTask[] | undefined, unsubtasksBacklog: Unsubscribe | undefined) => {
                    if (tasksData && unsubtasksBacklog) {
                      UNSUB_TASKS_OTHER = unsubtasksBacklog;
                      const tasksWithDetailsData: FullTask[] = enrichTasksWithAssignees(project.assigneesRegistry, tasksData);
                      settasksBacklog(tasksWithDetailsData);
                    }
                  }
                ).catch((e) => console.error(e));
              }
            }
          }
        ).catch((e) => console.error(e));
      }
    } else {
      navigate("/projects");
    }
    return () => unsubListener("all");
  }, [props, tab]);

  const unsubListener = (name: "tasks_other" | "project" | "all"): void => {
    if (["tasks_other", "all"].includes(name) && UNSUB_TASKS_OTHER) {
      UNSUB_TASKS_OTHER();
      UNSUB_TASKS_OTHER = undefined;
    }
    if (["project", "all"].includes(name) && UNSUB_PROJECT) {
      UNSUB_PROJECT();
      UNSUB_PROJECT = undefined;
    }
  };

  const removeAssignee = (assignee: FullAssignee): void => {
    if (project) {
      ProjectsAPI.userAsAssigneeBond(assignee, project, "break")
        .then(() => {})
        .catch((e) => console.error(e));
    }
  };

  const popupAssignToProjectForm = (): void =>
    showPopup(
      <AssignToProjectForm
        user={user}
        project={project}
      />
    );

  const popupConfirmDialog = (data: FullAssignee): void =>
    showPopup(
      <ConfirmDialog
        submitFn={() => removeAssignee(data)}
        whatAction="remove assignee from project"
        closeOnSuccess={true}
      />
    );

  const popupTaskForm = (list: TaskListType, task?: SimpleTask): void =>
    showPopup(
      <TaskForm
        project={project}
        task={task}
        taskList={list}
      />
    );

  const popupProjectForm = (project: ProjectWithAssigneesRegistry): void => showPopup(<ProjectForm project={project} />);

  return (
    <>
      {project && (
        <div className={`project-view-wrapper flex flex-col rounded-[14px] overflow-hidden  ${blockadeReason}`}>
          <div className="project-view justify-center font-app_primary bg-[rgba(241,241,241,1)] flex ">
            {/* Side - Left */}

            {/* Main */}
            <div className="project-view__main flex flex-col justify-start">
              {/* <RenderObject data={tasks} />
            {tab} */}
              <ProjectViewHeader
                projectTitle={project?.title}
                setTabFn={(tab: "backlog" | "schedule") => settab(tab)}
                tab={tab}
              />

              <div className={` min-h-[40px]  max-h-[40px]  flex-col font-app_primary w-full  text-center bg-neutral-200`}>
                <div className="flex w-full h-[40px] px-1  ">
                  <p className="h-full flex items-center text-[12px] ">
                    <span className=" text-neutral-500  uppercase ">Project: </span>
                    <span className=" text-neutral-600   ml-1 "> {project?.title}</span>
                  </p>
                  <p className="h-full ml-5 w-fit text-[10px] app_flex_center text-gray-500 font-app_mono ">
                    {getShortId(project.id)}
                  </p>
                  <div className="h-full px-2  flex w-full justify-end items-center">
                    <span className={` project-status-bg-${project.status} ${project.archived && "archived"} text-white`}>
                      {project.status}
                    </span>
                    {project.archived && <span className={`ml-2 project-status-bg-archived text-white`}>archived</span>}
                  </div>
                </div>
              </div>
              {tab === "backlog" && (
                <ProjectBacklog
                  project={project}
                  tasks={tasksBacklog}
                  popupTaskForm={(val) => popupTaskForm(tab, val)}
                />
              )}
              {tab === "schedule" && (
                <ProjectSchedule
                  project={project}
                  blockadeReason={blockadeReason}
                  popupTaskForm={(val) => popupTaskForm(tab, val)}
                />
              )}
            </div>

            {/* Side - Right */}
            <SidePanel for="project-view">
              <div className="h-full project-border border border-l-[1px] app_flex_center">
                {!project?.archived && (
                  <Button
                    label="Add assignee"
                    clickFn={popupAssignToProjectForm}
                    disabled={!!project?.archived}
                    formStyle="primary"
                  />
                )}
              </div>
              <div className="h-full project-border border border-y-0 ">
                {project &&
                  Object.entries(project.assigneesRegistry).map(([assigneeId, assignee], i) => (
                    <div
                      className="relative flex items-center py-2 border-none border-transparent"
                      key={i}>
                      <AssigneeIcon
                        assignee={assignee}
                        tailwindStyles="mx-[10px] "
                      />

                      <p
                        key={assignee.email}
                        className="text-[11px]">
                        {assignee.email}
                      </p>

                      {user?.authentication.id !== assignee.id && !editingRoles.includes(assignee.role) && (
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

          <div className="w-full min-h-[100px] max-h-[100px] flex Xbg-neutral-200 bg-[rgb(220,220,220)] project-border border app_flex_center ">
            {!project?.archived && (
              <div className="flex gap-4">
                <Button
                  label="Add task"
                  clickFn={popupTaskForm}
                  formStyle="primary"
                />
                {currentUserCanEdit && (
                  <Button
                    label="Edit project"
                    clickFn={() => project && popupProjectForm(project)}
                    formStyle="secondary"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectView;
