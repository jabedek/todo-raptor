import React, { useState } from "react";
import { generateDocumentId } from "frotsi";

import { FormButton, FormWrapper, InputSelect, InputWritten, InputTags, InputTagsTypes } from "@@components/forms";
import { TaskTypes } from "@@types";
import { TaskProgressStatus, STATUSES_OPTIONS } from "../TaskStatus/utils/task-statuses";

const NewTaskForm: React.FC = () => {
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [tags, settags] = useState<InputTagsTypes.TagItem[]>([]);
  const [assigneeId, setassigneeId] = useState("");
  const [status, setstatus] = useState<TaskProgressStatus>("new");

  const lookupAssigneeId = (val: string) => {
    setassigneeId(val);
  };

  const handleSubmit = () => {
    const task: TaskTypes.Task = {
      id: `task_${generateDocumentId()}`,
      title,
      description,
      tags: tags.map((t) => t.value),
      assigneeId,
      status,
      projectId: "test",
      createdAt: new Date().toISOString(),
      closedAt: undefined,
      visuals: {
        colorPrimary: "",
        colorSecondary: "",
        colorTertiary: "",
      },
    };
  };

  return (
    <FormWrapper
      title="Adding task"
      submitFn={handleSubmit}
      tailwindStyles="w-[500px]">
      <InputWritten
        required
        type="text"
        name="task-title"
        changeFn={(val) => settitle(val)}
        label="Title"
        value={title}
      />

      <InputWritten
        required
        type="text"
        name="task-assignee"
        changeFn={(val) => lookupAssigneeId(val)}
        label="Assignee"
        value={assigneeId}
      />

      <InputWritten
        required
        type="textarea"
        name="task-description"
        changeFn={(val) => setdescription(val)}
        label="Description"
        value={description}
      />

      <InputSelect
        required
        name="task-status"
        changeFn={(value) => setstatus(value)}
        label="Status"
        value={status}
        selectOptions={STATUSES_OPTIONS}
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

      <FormButton
        style="primary"
        tailwindStyles="mt-8"
        clickFn={handleSubmit}>
        Submit
      </FormButton>
    </FormWrapper>
  );
};

export default NewTaskForm;
