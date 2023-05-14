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
};

const NewTaskForm: React.FC<Props> = ({ project }) => {
  type Option = BasicInputsTypes.SelectOption<ProjectTypes.ProjectTeamMember>;
  const [title, settitle] = useState("");
  const [description, setdescription] = useState("");
  const [tags, settags] = useState<InputTagsTypes.TagItem[]>([]);
  const [assignee, setassignee] = useState<ProjectTypes.ProjectTeamMember>();
  const [status, setstatus] = useState<TaskProgressStatus>("new");
  const [membersOptions, setmembersOptions] = useState<Option[]>([]);
  const [message, setmessage] = useState<CommonTypes.ResultDisplay>();

  useEffect(() => {
    const options: Option[] = (project?.teamMembers || []).map((member) => {
      const memberEmail = `${member.email}`;
      return { label: memberEmail, value: { ...member, email: memberEmail } };
    });

    setmembersOptions(options);
  }, [project?.teamMembers]);

  const handleSubmit = () => {
    if (project && assignee) {
      const task: TaskTypes.Task = {
        id: `task_${generateDocumentId()}`,
        title,
        description,
        tags: tags.map((t) => t.value),
        assigneeId: assignee?.id,
        status,
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

      console.log(task);

      TasksAPI.saveNewTaskInDB(task)
        .then(() => {
          setmessage({ text: "Task has been added to project.", isError: false });
        })
        .catch((e) => {
          console.error(e);

          setmessage({ isError: true, text: "Error during adding task. See console." });
        });
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
        label="Select member from your contacts"
        value={assignee}
        options={membersOptions}
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
        clickFn={handleSubmit}>
        Submit
      </Button>
    </FormWrapper>
  );
};

export default NewTaskForm;
