import { FormButton, FormWrapper, InputSelect, InputWritten, TagItem, InputTags } from "@@components/FormElements";
import { STATUSES_OPTIONS, TaskProgressStatus } from "@@components/Tasks/TaskStatus/task-statuses";
import { Task } from "@@types/Task";
import { generateDocumentId } from "frotsi";
import React, { useState } from "react";

const NewTaskForm: React.FC = () => {
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [tags, settags] = useState<TagItem[]>([]);
  const [assigneeId, setassigneeId] = useState("");
  const [status, setstatus] = useState<TaskProgressStatus>("new");

  const lookupAssigneeId = (val: string) => {
    setassigneeId(val);
  };

  const submit = () => {
    const task: Task = {
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
        values={tags}
      />

      <FormButton
        style="primary"
        tailwindStyles="mt-8"
        clickFn={submit}>
        Submit
      </FormButton>
    </FormWrapper>
  );
};

export default NewTaskForm;
