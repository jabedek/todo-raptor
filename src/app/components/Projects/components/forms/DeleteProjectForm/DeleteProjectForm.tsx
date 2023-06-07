import { CallbackFn } from "frotsi";
import { useState } from "react";

import { FormWrapper, InputWritten, Button, WrittenChangeEvent } from "@@components/common";
import { Project } from "@@types";

type Props = { project: Project; deleteFn: CallbackFn };

export const DeleteProjectForm: React.FC<Props> = ({ project, deleteFn }) => {
  const [title, settitle] = useState("");
  const handleClick = (): void => deleteFn();

  return (
    <FormWrapper
      title="Deleting project"
      tailwindStyles="w-[500px] min-h-[380px]">
      <p className="text-lg font-app_mono px-2 py-1 rounded-md shadow-md ">{project.title}</p>
      <p className="bg-[rgba(255,0,0,0.3)]">Are you sure you want to delete this project?</p>

      <InputWritten
        value={title}
        type="text"
        changeFn={(event: WrittenChangeEvent, val: string) => settitle(val)}
        name="project-title"
        label="Please enter title of the project"
        tailwindStyles="min-w-[250px] w-full"
      />
      <Button
        formStyle="primary"
        disabled={project.title !== title}
        clickFn={handleClick}
        label="Submit"
      />
    </FormWrapper>
  );
};
