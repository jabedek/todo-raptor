import React, { useEffect, useState } from "react";
import { generateDocumentId } from "frotsi";

import {
  FormWrapper,
  InputSelect,
  InputWritten,
  InputTags,
  ResultDisplay,
  ResultDisplayer,
  TagItem,
  SelectOption,
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
import { SimpleColumn, ProjectWithAssigneesRegistry } from "src/app/types/Projects";

type Props = {
  project: ProjectWithAssigneesRegistry | undefined;
  task?: SimpleTask;
};

const TaskForm: React.FC<Props> = ({ project, task }) => {
  type Option = SelectOption<SimpleProjectAssignee>;
  const [id, setid] = useState("");
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [tags, settags] = useState<TagItem[]>([]);
  const [assignee, setassignee] = useState<SimpleProjectAssignee>();
  const [status, setstatus] = useState<TaskStatusShortName>(TASK_STATUSES_OPTIONS[0].value);
  const [list, setlist] = useState<TaskListType>("backlog");

  const [assigneesOptions, setassigneesOptions] = useState<Option[]>([]);
  const [message, setmessage] = useState<ResultDisplay>();
  const [formMode, setformMode] = useState<"new" | "edit">("new");

  useEffect(() => {
    const options: Option[] = (project?.assignees || []).map((assignee) => {
      const assigneeEmail = `${assignee.email}`;
      return { label: assigneeEmail, value: { ...assignee, email: assigneeEmail } };
    });

    setassigneesOptions(options);
  }, [project?.assignees]);

  useEffect(() => {
    if (task) {
      setformMode("edit");
      setid(task.id);
    } else {
      setformMode("new");
      setid(`task_${generateDocumentId()}`);
    }
  }, [task]);

  const handleSubmitNewTask = () => {
    if (project) {
      const assigneeId = assignee?.id || "";
      const taskNumber = (project?.tasksCounter || 0) + 1;
      const task: SimpleTask = {
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

      if (list === "backlog") {
        newProject.tasksLists.backlog.push(task.id);
      }

      if (list === "archive") {
        newProject.tasksLists.archive.push(task.id);
        task.archived = true;
      }

      if (list === "schedule") {
        scheduleColumn = getStatusGroup(task.status);
      }
      newProject.tasksCounter = (project?.tasksCounter || 0) + 1;

      TasksAPI.saveNewTaskInDB(task, newProject, assigneeId, scheduleColumn)
        .then(() => {
          setmessage({ text: "SimpleTask has been added to project.", isError: false });
          setid(`task_${generateDocumentId()}`);
        })
        .catch((e) => {
          console.error(e);
          setmessage({ isError: true, text: "Error during adding task. See console." });
        });
    }
  };

  const handleSubmitEditedTask = () => {};

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
    setlist("backlog");
  };

  return (
    <FormWrapper
      title={`Adding task to project [${project?.title}]`}
      submitFn={handleSubmit}
      tailwindStyles="w-[500px]">
      {/* <div className="w-full app_flex_center mt-3 ">
        <div className=" bg-[rgb(243,244,246)]  text-[rgb(156,163,175)] font-app_mono font-light text-[12px]">ID:[{id}]</div>
      </div> */}

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
          changeFn={(value) => setlist(value)}
          label="List"
          value={list}
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
          clickFn={handleSubmitNewTask}>
          Submit
        </Button>

        {formMode === "new" && (
          <Button
            formStyle="secondary"
            clickFn={resetForm}>
            Clear
          </Button>
        )}
      </div>
    </FormWrapper>
  );
};

export default TaskForm;
