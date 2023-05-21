import { useEffect, useState } from "react";
import { Unsubscribe } from "firebase/auth";

import "./ProjectView.scss";
import {
  Project,
  FullProjectAssignee,
  SimpleTask,
  FullTask,
  TasksOther,
  ProjectsFullData,
  ProjectWithAssigneesRegistry,
} from "@@types";
import { ProjectsAPI, TasksAPI } from "@@api/firebase";
import { useUserValue } from "@@contexts";
import { Button, SidePanel } from "@@components/common";
import { usePopupContext } from "@@components/Layout";
import { ConfirmDialog, FormClearX } from "@@components/forms";
import { TaskForm, TasksVisuals } from "@@components/Tasks";
import { AssignToProjectForm, ProjectAssigneeIcon, ProjectViewHeader } from "@@components/Projects";
import ProjectSchedule from "./tabs/ProjectSchedule/ProjectSchedule";
import ProjectBacklog from "./tabs/ProjectBacklog/ProjectBacklog";
import { TaskListType } from "@@components/Tasks/visuals/task-visuals";
import { enrichTasksWithAssignees } from "@@components/Tasks/task-utils";
import { useNavigate } from "react-router-dom";

type Props = { projectData: Project | undefined; projectId: string };

let UNSUB_TASKS_OTHER: Unsubscribe | undefined = undefined;
let UNSUB_PROJECT: Unsubscribe | undefined = undefined;

const ProjectView: React.FC<Props> = (props) => {
  const [tab, settab] = useState<TaskListType>("schedule");
  const [tasksOther, settasksOther] = useState<TasksOther<FullTask>>({ backlog: [], archive: [] });
  const [project, setproject] = useState<ProjectWithAssigneesRegistry>();
  const { user, canUseAPI } = useUserValue();
  const { showPopup } = usePopupContext();
  const navigate = useNavigate();

  useEffect(() => {
    unsubListener("project");
    if (props.projectData !== undefined) {
      if (user && canUseAPI) {
        const projectData = props.projectData;
        ProjectsAPI.listenProjectsWithAssigneesData([projectData.id], true, (data: ProjectsFullData, unsubProject) => {
          UNSUB_PROJECT = unsubProject;
          const project = projectData?.archived ? data.archived[0] : data.active[0];

          setproject(project);

          if (project && tab !== "schedule") {
            // Listen to tasks for Backlog & Archive
            unsubListener("tasks_other");
            TasksAPI.listenToProjectOtherTasks(project, (tasksData: TasksOther<SimpleTask>, unsubTasksOther) => {
              UNSUB_TASKS_OTHER = unsubTasksOther;
              const tasksWithDetailsData: TasksOther<FullTask> = {
                archive: enrichTasksWithAssignees(project.assigneesRegistry, tasksData.archive),
                backlog: enrichTasksWithAssignees(project.assigneesRegistry, tasksData.backlog),
              };
              settasksOther(tasksWithDetailsData);
            });
          }
        });
      }
    } else {
      navigate("/projects");
    }
    return () => unsubListener("all");
  }, [props, tab]);

  const unsubListener = (name: "tasks_other" | "project" | "all") => {
    if (["tasks_other", "all"].includes(name) && UNSUB_TASKS_OTHER) {
      UNSUB_TASKS_OTHER();
      UNSUB_TASKS_OTHER = undefined;
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

  const popupConfirmDialog = (data: FullProjectAssignee) =>
    showPopup(
      <ConfirmDialog
        submitFn={() => removeAssignee(data)}
        whatAction="remove assignee from project"
        closeOnSuccess={true}
      />
    );

  const removeAssignee = (assignee: FullProjectAssignee) => {
    if (project) {
      ProjectsAPI.userAsAssigneeBond(assignee, project, "break")
        .then(() => {})
        .catch((e) => console.error(e));
    }
  };

  const popupTaskForm = (list: TaskListType, task?: SimpleTask) =>
    showPopup(
      <TaskForm
        project={project}
        task={task}
        taskList={list}
      />
    );

  return (
    <>
      <div className="project-view-wrapper flex flex-col rounded-[14px] overflow-hidden">
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

            <div
              className={` min-h-[40px] max-h-[40px] font-app_primary font-bold w-full app_flex_center text-center bg-neutral-200`}>
              <p className="h-full text-[14px]  py-2">
                <span className="text-[13px] font-light ">Project: </span>
                {project?.title}
              </p>
            </div>
            {tab === "backlog" && (
              <ProjectBacklog
                project={project}
                tasks={tasksOther.backlog}
                popupTaskForm={(val) => popupTaskForm(tab, val)}
              />
            )}
            {tab === "schedule" && (
              <ProjectSchedule
                project={project}
                // tasksColumns={tasksColumns}
                popupTaskForm={(val) => popupTaskForm(tab, val)}
              />
            )}
          </div>

          {/* Side - Right */}
          <SidePanel for="project-view">
            <div className="h-full project-border border border-l-[1px] app_flex_center">
              <Button
                label="Add assignee"
                clickFn={popupAssignToProjectForm}
                formStyle="primary"
              />
            </div>
            <div className="h-full project-border border border-y-0 ">
              {project &&
                Object.entries(project.assigneesRegistry).map(([assigneeId, assignee], i) => (
                  <div
                    className="relative flex items-center py-2 border-none border-transparent"
                    key={i}>
                    <ProjectAssigneeIcon
                      assignee={assignee}
                      tailwindStyles="mx-[10px] "
                    />

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

        <div className="w-full min-h-[100px] max-h-[100px] flex Xbg-neutral-200 bg-[rgb(220,220,220)] project-border border app_flex_center ">
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
