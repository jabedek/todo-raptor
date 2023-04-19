import { FormButton, FormWrapper, InputSelect, InputWritten } from "@@components/FormElements";
import InputTags from "@@components/FormElements/complex-inputs/InputTags";
import { TagItem } from "@@components/FormElements/types";
import { STATUSES, STATUSES_OPTIONS, TaskProgressStatus } from "@@components/TaskStatus/task-statuses";
import RenderObject from "@@components/common/RenderObject";
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
      id: generateDocumentId(),
      title,
      description,
      tags: tags.map((t) => t.value),
      assigneeId,
      status,
      projectId: "test",
      createdAt: new Date().toISOString(),
      closedAt: undefined,
    };
  };

  return (
    <div className="app_flex_center relative top-[300px] ">
      <FormWrapper
        title="Adding task"
        styles="w-[400px]">
        <InputWritten
          required
          type="text"
          name="task-title"
          onChange={(val) => settitle(val)}
          label="Title"
          value={title}
        />

        <InputWritten
          required
          type="text"
          name="task-assignee"
          onChange={(val) => lookupAssigneeId(val)}
          label="Assignee"
          value={assigneeId}
        />

        <InputWritten
          required
          type="textarea"
          name="task-description"
          onChange={(val) => setdescription(val)}
          label="Description"
          value={description}
        />

        <InputSelect
          required
          name="task-status"
          onChange={(value) => setstatus(value)}
          label="Status"
          value={status}
          selectOptions={STATUSES_OPTIONS}
        />

        <InputTags
          required
          name="task-tags"
          onChange={(val) => settags(val)}
          label="Tags"
          values={tags}
        />

        <FormButton
          style="primary"
          tailwindStyles="mt-8"
          action={submit}>
          Submit
        </FormButton>
      </FormWrapper>
    </div>
  );
};

export default NewTaskForm;
