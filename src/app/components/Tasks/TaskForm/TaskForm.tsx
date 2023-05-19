import React, { useEffect, useState } from "react";
import { generateDocumentId } from "frotsi";

import {
  FormWrapper,
  InputSelect,
  InputWritten,
  InputTags,
  InputTagsTypes,
  BasicInputsTypes,
  ResultDisplayer,
} from "@@components/forms";
import { CommonTypes, ProjectTypes, TaskTypes } from "@@types";
import { Button } from "@@components/common";
import { TasksAPI } from "@@api/firebase";
import {
  TASK_LISTS_OPTIONS,
  TASK_STATUSES_OPTIONS,
  TaskListType,
  TaskStatus,
  TaskStatusShortName,
} from "@@components/RolesStatusesVisuals/roles-statuses-visuals";

type Props = {
  project: ProjectTypes.Project | undefined;
  task?: TaskTypes.Task;
};

const TaskForm: React.FC<Props> = ({ project, task }) => {
  type Option = BasicInputsTypes.SelectOption<ProjectTypes.ProjectAssignee>;
  const [id, setid] = useState("");
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [tags, settags] = useState<InputTagsTypes.TagItem[]>([]);
  const [assignee, setassignee] = useState<ProjectTypes.ProjectAssignee>();
  const [status, setstatus] = useState<TaskStatusShortName>(TASK_STATUSES_OPTIONS[0].value);
  const [list, setlist] = useState<TaskListType>("backlog");

  const [assigneesOptions, setassigneesOptions] = useState<Option[]>([]);
  const [message, setmessage] = useState<CommonTypes.ResultDisplay>();
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
    if (project && assignee) {
      const taskNumber = (project?.tasksCounter || 0) + 1;
      const task: TaskTypes.Task = {
        id,
        title: title.replace(RegExp(/\s{2,}/gm), " ").trim(),
        description,
        tags: tags.map((t) => t.value),
        assigneeId: assignee.id,
        status,
        taskNumber,
        projectId: project.id,
        createdAt: new Date().toISOString(),
        closedAt: "",
        list: {
          type: list,
          position: 1000 + taskNumber,
          scheduleColumn: "",
        },
      };

      TasksAPI.saveNewTaskInDB(task, assignee, project)
        .then(() => {
          setmessage({ text: "Task has been added to project.", isError: false });
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
        required
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
          disabled={!(status && title && assignee)}
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
