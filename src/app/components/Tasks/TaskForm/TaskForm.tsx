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
import { TaskProgressStatus, STATUSES_OPTIONS } from "../TaskStatus/utils/task-statuses";
import { Button } from "@@components/common";
import { TasksAPI } from "@@api/firebase";

type Props = {
  project: ProjectTypes.Project | undefined;
  task?: TaskTypes.Task;
};

const TaskForm: React.FC<Props> = ({ project, task }) => {
  type Option = BasicInputsTypes.SelectOption<ProjectTypes.ProjectTeamMember>;
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [tags, settags] = useState<InputTagsTypes.TagItem[]>([]);
  const [assignee, setassignee] = useState<ProjectTypes.ProjectTeamMember>();
  const [status, setstatus] = useState<TaskProgressStatus>("new");
  const [assigneesOptions, setassigneesOptions] = useState<Option[]>([]);
  const [message, setmessage] = useState<CommonTypes.ResultDisplay>();
  const [formMode, setformMode] = useState<"new" | "edit">("new");

  useEffect(() => {
    const options: Option[] = (project?.teamMembers || []).map((member) => {
      const memberEmail = `${member.email}`;
      return { label: memberEmail, value: { ...member, email: memberEmail } };
    });

    setassigneesOptions(options);
  }, [project?.teamMembers]);

  useEffect(() => {
    if (task) {
      setformMode("edit");
    } else {
      setformMode("new");
    }
  }, [task]);

  const handleSubmitNewTask = () => {
    if (project && assignee) {
      const task: TaskTypes.Task = {
        id: `task_${generateDocumentId()}`,
        title: title.replace(RegExp(/\s{2,}/gm), " ").trim(),
        description,
        tags: tags.map((t) => t.value),
        assigneeId: assignee?.id,
        status,
        taskNumber: (project?.tasksCounter || 0) + 1,
        projectId: project.id,
        createdAt: new Date().toISOString(),
        closedAt: "",
        visuals: {
          colorPrimary: "",
          colorSecondary: "",
          colorTertiary: "",
        },
        onList: "backlog",
      };

      TasksAPI.saveNewTaskInDB(task, project)
        .then(() => {
          setmessage({ text: "Task has been added to project.", isError: false });
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

  return (
    <FormWrapper
      title={`Adding task to project [${project?.title}]`}
      submitFn={handleSubmit}
      tailwindStyles="w-[500px]">
      <InputWritten
        required
        type="text"
        name="task-title"
        changeFn={(val) => settitle(val)}
        label="Title"
        value={title}
        tailwindStyles="min-w-[250px] w-full"
      />
      {/* 
      <InputWritten
        required
        type="text"
        name="task-assignee"
        changeFn={(val) => lookupAssigneeId(val)}
        label="Assignee"
        value={assigneeId}
        tailwindStyles="min-w-[250px] w-full"
      /> */}

      <InputSelect
        required
        name="assignee"
        selectWidth="w-[460px]"
        changeFn={(val) => setassignee(val)}
        label="Assign member"
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

      <InputSelect
        required
        name="task-status"
        selectWidth="w-[200px]"
        changeFn={(value) => setstatus(value)}
        label="Status"
        value={status}
        options={STATUSES_OPTIONS}
      />

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

      <Button
        formStyle="primary"
        tailwindStyles="mt-8"
        disabled={!(status && title && assignee)}
        clickFn={handleSubmitNewTask}>
        Submit
      </Button>
    </FormWrapper>
  );
};

export default TaskForm;
