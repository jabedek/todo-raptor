import React, { useEffect, useState } from "react";
import { generateDocumentId, generateInputId } from "frotsi";

import { TasksAPI } from "@@api/firebase";
import { Project, ProjectWithAssigneesRegistry, ScheduleAction, SimpleAssignee, SimpleTask } from "@@types";
import {
  ConfirmDialog,
  FormWrapper,
  InputSelect,
  InputTags,
  InputWritten,
  ResultDisplay,
  ResultDisplayer,
  SelectOption,
  TagItem,
  WrittenChangeEvent,
} from "@@components/forms";
import { Button } from "@@components/common";
import { getStatusGroup, TASK_LISTS_OPTIONS, TASK_STATUSES_OPTIONS, TaskListType, TaskStatusShortName } from "@@components/Tasks";
import { usePopupContext } from "@@components/Layout";
import { getShortId } from "@@utils/id";

type Props = {
  project: ProjectWithAssigneesRegistry | undefined;
  task?: SimpleTask;
  taskList: TaskListType;
};

export const TaskForm: React.FC<Props> = ({ project, task, taskList }) => {
  type Option = SelectOption<SimpleAssignee>;
  const [id, setid] = useState("");
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [tags, settags] = useState<TagItem[]>([]);
  const [assignee, setassignee] = useState<SimpleAssignee>();
  const [status, setstatus] = useState<TaskStatusShortName>(TASK_STATUSES_OPTIONS[0].value);
  const [newList, setnewList] = useState<TaskListType>("backlog");

  const [assigneesOptions, setassigneesOptions] = useState<Option[]>([]);
  const [message, setmessage] = useState<ResultDisplay>();
  const [formMode, setformMode] = useState<"new" | "edit">("new");
  const { showPopup, hidePopup } = usePopupContext();

  useEffect(() => {
    if (task && taskList) {
      const status = TASK_STATUSES_OPTIONS.find(({ value }) => value === task.status) || TASK_STATUSES_OPTIONS[0];
      setstatus(status.value);

      setformMode("edit");
      setid(task.id);
      settitle(task.title);
      setdescription(task.description);
      settags(task.tags.map((value) => ({ value, temporaryId: generateInputId("task-tags", "tag") })));
      setnewList(taskList);
    } else {
      setformMode("new");
      setid(`task_${generateDocumentId()}`);
    }
  }, [project, task, taskList]);

  useEffect(() => {
    const options: Option[] = (project?.assignees || []).map((assignee) => {
      const assigneeEmail = `${assignee.email}`;
      return { label: assigneeEmail, value: { ...assignee, email: assigneeEmail } };
    });

    if (formMode === "edit" && task) {
      const assignee = options.find(({ value }) => value.id === `${task.assigneeId}`)?.value ?? undefined;
      setassignee(assignee);
    }

    setassigneesOptions(options);
  }, [formMode]);

  const handleSubmitNewTask = (): void => {
    if (project) {
      const assigneeId = assignee?.id || "";
      const taskNumber = (project?.tasksCounter || 0) + 1;
      const newTask: SimpleTask = {
        id,
        title: title.replace(RegExp(/\s{2,}/gm), " ").trim(),
        description,
        tags: tags.map((t) => t.value),
        assigneeId: assigneeId,
        status,
        taskNumber,
        projectId: project.id,
        createdAt: new Date().toISOString(),
        closedAt: "",
      };

      const { assigneesRegistry, ...newProject } = project;

      let scheduleColumn = "";

      if (newList === "backlog") {
        newProject.tasksLists.backlog.push(newTask.id);
      }

      if (newList === "schedule") {
        scheduleColumn = getStatusGroup(newTask.status);
      }
      newProject.tasksCounter = (project?.tasksCounter || 0) + 1;

      saveTask(newTask, newProject, assigneeId, { oldColumn: "", column: scheduleColumn, action: "add-to-schedule" });
    }
  };

  const handleSubmitEditedTask = (): void => {
    if (project && task) {
      const assigneeId = assignee?.id || "";
      const taskNumber = (project?.tasksCounter || 0) + 1;
      const newTask: SimpleTask = {
        id,
        title: title.replace(RegExp(/\s{2,}/gm), " ").trim(),
        description,
        tags: tags.map((t) => t.value),
        assigneeId: assigneeId,
        status,
        taskNumber,
        projectId: project.id,
        createdAt: new Date().toISOString(),
        closedAt: "",
      };

      const { assigneesRegistry, ...newProject } = project;

      const scheduleAction: ScheduleAction = {
        oldColumn: getStatusGroup(task?.status),
        column: getStatusGroup(newTask.status),
        action: "add-to-schedule",
      };

      const listChanged = taskList !== newList;
      if (listChanged) {
        if (newList !== "schedule") {
          newProject.tasksLists[newList] = [...newProject.tasksLists[newList], id];
          scheduleAction.action = "remove-from-schedule";
        } else {
          newProject.tasksLists.backlog = newProject.tasksLists.backlog.filter((taskId) => taskId !== id);
          scheduleAction.action = "add-to-schedule";
        }
      } else {
        scheduleAction.action = "move";
      }

      newProject.tasksCounter = (project?.tasksCounter || 0) + 1;

      saveTask(newTask, newProject, assigneeId, scheduleAction);
    }
  };

  const handleSubmit = (): void => {
    if (formMode === "new") {
      handleSubmitNewTask();
    } else {
      handleSubmitEditedTask();
    }
  };

  const resetForm = (): void => {
    setid(`task_${generateDocumentId()}`);
    settitle("");
    setdescription("");
    settags([]);
    setassignee(undefined);
    setstatus(TASK_STATUSES_OPTIONS[0].value);
    setnewList("backlog");
  };

  const saveTask = (
    task: SimpleTask,
    project: Project | null | undefined,
    assigneeId: string | undefined,
    schedule: ScheduleAction
  ): void => {
    if (!project || !task) {
      return undefined;
    }

    setmessage({ isLoading: true, isError: false, text: "" });
    TasksAPI.saveTask(task, project, assigneeId, schedule)
      .then(() => {
        setmessage({ text: "Task has been saved.", isError: false });
        setid(`task_${generateDocumentId()}`);
        hidePopup();
      })
      .catch((e) => {
        console.error(e);
        setmessage({ isError: true, text: "Error during saving task. See console." });
      });
  };

  const popupConfirmDialog = (data: { taskId: string; projectId: string; assigneeId?: string }): void =>
    showPopup(
      <ConfirmDialog
        submitFn={() => deleteTask(data.taskId, data.projectId)}
        whatAction="delete task"
        closeOnSuccess={true}
      />
    );

  const deleteTask = (taskId: string, projectId: string): void => {
    TasksAPI.deleteTask(taskId, projectId)
      ?.then(() => {
        setmessage({ text: "Task has been deleted.", isError: false });
        setid(`task_${generateDocumentId()}`);
      })
      .catch((e) => {
        console.error(e);
        setmessage({ isError: true, text: "Error during deleting task. See console." });
      });
  };

  return (
    <FormWrapper
      title={`${formMode === "new" ? "Adding" : "Editing"} task [project: #${project?.title}]`}
      submitFn={handleSubmit}
      tailwindStyles="w-[500px]">
      <p className=" w-fit text-[10px] my-2 text-gray-500 font-app_mono flex items-end">{getShortId(id)}</p>
      <InputWritten
        required
        type="text"
        name="task-title"
        changeFn={(event: WrittenChangeEvent, val: string) => settitle(val)}
        label="Title"
        value={title}
        tailwindStyles="min-w-[250px] w-full"
      />

      <InputSelect
        name="assignee"
        selectWidth="w-[460px]"
        changeFn={(val: SimpleAssignee) => setassignee(val)}
        label="Assign assignee"
        value={assignee}
        options={assigneesOptions}
      />

      <InputWritten
        required
        type="textarea"
        name="task-description"
        changeFn={(event: WrittenChangeEvent, val: string) => setdescription(val)}
        label="Description"
        value={description}
        tailwindStyles="min-w-[250px] w-full mt-3"
      />

      <div className="flex justify-between w-full">
        <InputSelect
          required
          name="task-status"
          selectWidth="w-[200px]"
          changeFn={(value) => setstatus(value as TaskStatusShortName)}
          label="Status"
          value={status}
          options={TASK_STATUSES_OPTIONS}
        />

        <InputSelect
          required
          name="task-list"
          selectWidth="w-[200px]"
          changeFn={(value) => setnewList(value as "backlog" | "schedule")}
          label="List"
          value={newList}
          options={TASK_LISTS_OPTIONS}
        />
      </div>

      <InputTags
        required
        name="task-tags"
        changeFn={(val: TagItem[]) => settags(val)}
        label="Tags"
        hint="Tags could be used to describe task. They can describe main problems, technologies, etc."
        values={tags}
        disabled={tags.length === 5}
      />

      <ResultDisplayer message={message} />
      <div className="flex w-full justify-evenly mt-1">
        <Button
          formStyle="primary"
          disabled={!(status && title)}
          clickFn={handleSubmit}>
          Submit
        </Button>

        {formMode === "new" && (
          <Button
            formStyle="secondary"
            clickFn={resetForm}>
            Clear
          </Button>
        )}

        {formMode === "edit" && (
          <Button
            formStyle="secondary"
            disabled={!(status && title && project && id)}
            clickFn={() => project && popupConfirmDialog({ taskId: id, projectId: project.id, assigneeId: assignee?.id })}>
            Delete
          </Button>
        )}
      </div>
    </FormWrapper>
  );
};
