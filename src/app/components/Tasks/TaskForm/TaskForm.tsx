import React, { useEffect, useState } from "react";
import { generateDocumentId, generateInputId } from "frotsi";

import {
  FormWrapper,
  InputSelect,
  InputWritten,
  InputTags,
  ResultDisplay,
  ResultDisplayer,
  TagItem,
  SelectOption,
  ConfirmDialog,
} from "@@components/forms";
import { Project, SimpleProjectAssignee, SimpleTask } from "@@types";
import { Button } from "@@components/common";
import { TasksAPI } from "@@api/firebase";
import { TasksVisuals } from "..";
import {
  TaskStatusShortName,
  TASK_STATUSES_OPTIONS,
  TaskListType,
  TASK_LISTS_OPTIONS,
  getStatusGroup,
  StatusGroupName,
} from "../visuals/task-visuals";
import { SimpleColumn, ProjectWithAssigneesRegistry, ScheduleAction } from "src/app/types/Projects";
import { usePopupContext } from "@@components/Layout";
import { getShortId } from "../task-utils";

type Props = {
  project: ProjectWithAssigneesRegistry | undefined;
  task?: SimpleTask;
  taskList: TaskListType;
};

const TaskForm: React.FC<Props> = ({ project, task, taskList }) => {
  type Option = SelectOption<SimpleProjectAssignee>;
  const [id, setid] = useState("");
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [tags, settags] = useState<TagItem[]>([]);
  const [assignee, setassignee] = useState<SimpleProjectAssignee>();
  const [status, setstatus] = useState<TaskStatusShortName>(TASK_STATUSES_OPTIONS[0].value);
  const [newList, setnewList] = useState<TaskListType>("backlog");

  const [assigneesOptions, setassigneesOptions] = useState<Option[]>([]);
  const [message, setmessage] = useState<ResultDisplay>();
  const [formMode, setformMode] = useState<"new" | "edit">("new");
  const { showPopup, hidePopup } = usePopupContext();

  useEffect(() => {
    const options: Option[] = (project?.assignees || []).map((assignee) => {
      const assigneeEmail = `${assignee.email}`;
      return { label: assigneeEmail, value: { ...assignee, email: assigneeEmail } };
    });
    setassigneesOptions(options);
    console.log(task, taskList);

    if (task && taskList) {
      const assignee = options.find(({ value }) => value.id === `${task.assigneeId}`)?.value ?? undefined;
      const status = TASK_STATUSES_OPTIONS.find(({ value }) => value === task.status) || TASK_STATUSES_OPTIONS[0];

      setformMode("edit");
      setid(task.id);
      settitle(task.title);
      setdescription(task.description);
      settags(task.tags.map((value) => ({ value, temporaryId: generateInputId("task-tags", "tag") })));
      setassignee(assignee);
      setstatus(status.value);
      setnewList(taskList);
    } else {
      setformMode("new");
      setid(`task_${generateDocumentId()}`);
    }
  }, [project, task, taskList]);

  const handleSubmitNewTask = () => {
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
        archived: false,
      };

      const { assigneesRegistry, ...newProject } = project;

      let scheduleColumn = "";

      if (newList === "backlog") {
        newProject.tasksLists.backlog.push(newTask.id);
      }

      if (newList === "archive") {
        newProject.tasksLists.archive.push(newTask.id);
        newTask.archived = true;
      }

      if (newList === "schedule") {
        scheduleColumn = getStatusGroup(newTask.status);
      }
      newProject.tasksCounter = (project?.tasksCounter || 0) + 1;
      console.log("handleSubmitNewTask", newTask);

      saveTask(newTask, newProject, assigneeId, { oldColumn: "", column: scheduleColumn, action: "add-to-schedule" });
    }
  };

  const handleSubmitEditedTask = () => {
    console.log("handleSubmitEditedTask", project);

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
        archived: newList === "archive",
      };

      const { assigneesRegistry, ...newProject } = project;
      console.log(newList, taskList);

      let scheduleAction: ScheduleAction = {
        oldColumn: getStatusGroup(task?.status),
        column: getStatusGroup(newTask.status),
        action: "add-to-schedule",
      };

      if (status !== task?.status) {
      }

      console.log(newProject.tasksLists);

      let listChanged = taskList !== newList;

      if (listChanged) {
        if (newList !== "schedule") {
          newProject.tasksLists[newList] = [...newProject.tasksLists[newList], id];
          scheduleAction.action = "remove-from-schedule";
        } else {
          newProject.tasksLists["archive"] = newProject.tasksLists["archive"].filter((taskId) => taskId !== id);
          newProject.tasksLists["backlog"] = newProject.tasksLists["backlog"].filter((taskId) => taskId !== id);
          scheduleAction.action = "add-to-schedule";
        }
      } else {
        scheduleAction.action = "move";
      }

      console.table(task);
      console.table(newTask);

      newProject.tasksCounter = (project?.tasksCounter || 0) + 1;

      saveTask(newTask, newProject, assigneeId, scheduleAction);
    }
  };

  const handleSubmit = () => {
    if (formMode === "new") {
      handleSubmitNewTask();
    } else {
      handleSubmitEditedTask();
    }
  };

  const resetForm = () => {
    setid(`task_${generateDocumentId()}`);
    settitle("");
    setdescription("");
    settags([]);
    setassignee(undefined);
    setstatus(TASK_STATUSES_OPTIONS[0].value);
    setnewList("backlog");
  };

  const saveTask = async (
    task: SimpleTask,
    project: Project | null | undefined,
    assigneeId: string | undefined,
    schedule: ScheduleAction
  ) => {
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

  const popupConfirmDialog = (data: { taskId: string; projectId: string; assigneeId?: string }) =>
    showPopup(
      <ConfirmDialog
        submitFn={() => deleteTask(data.taskId, data.projectId, data.assigneeId || "")}
        whatAction="delete task"
        closeOnSuccess={true}
      />
    );

  const deleteTask = async (taskId: string, projectId: string, assigneeId = "") =>
    TasksAPI.deleteTask(taskId, projectId, assigneeId)
      .then(() => {
        setmessage({ text: "Task has been deleted.", isError: false });
        setid(`task_${generateDocumentId()}`);
      })
      .catch((e) => {
        console.error(e);
        setmessage({ isError: true, text: "Error during deleting task. See console." });
      });

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
        changeFn={(val) => settitle(val)}
        label="Title"
        value={title}
        tailwindStyles="min-w-[250px] w-full"
      />

      <InputSelect
        name="assignee"
        selectWidth="w-[460px]"
        changeFn={(val) => setassignee(val)}
        label="Assign assignee"
        value={assignee}
        options={assigneesOptions}
      />

      <InputWritten
        required
        type="textarea"
        name="task-description"
        changeFn={(val) => setdescription(val)}
        label="Description"
        value={description}
        tailwindStyles="min-w-[250px] w-full mt-3"
      />

      <div className="flex justify-between w-full">
        <InputSelect
          required
          name="task-status"
          selectWidth="w-[200px]"
          changeFn={(value) => setstatus(value)}
          label="Status"
          value={status}
          options={TASK_STATUSES_OPTIONS}
        />
        <InputSelect
          required
          name="task-list"
          selectWidth="w-[200px]"
          changeFn={(value) => setnewList(value)}
          label="List"
          value={newList}
          options={TASK_LISTS_OPTIONS}
        />
      </div>

      <InputTags
        required
        name="task-tags"
        changeFn={(val) => settags(val)}
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

export default TaskForm;
