import { CallbackFn } from "frotsi";
import { useState } from "react";

import { FormWrapper, InputWritten, FormButton, ResultDisplayer } from "@@components/forms";
import { ProjectTypes, CommonTypes } from "@@types";

const DeleteProjectForm: React.FC<{ project: ProjectTypes.Project; deleteFn: CallbackFn }> = (props) => {
  const [title, settitle] = useState("");
  const [message, setmessage] = useState<CommonTypes.ResultDisplay>({ isError: false, text: "" });
  const handleClick = () => {
    props.deleteFn();
  };

  return (
    <>
      <FormWrapper
        title="Deleting project"
        tailwindStyles="w-[500px] min-h-[380px]">
        <p className="text-lg font-app_mono px-2 py-1 rounded-md shadow-md ">{props.project.title}</p>
        <p className="bg-[rgba(255,0,0,0.3)]">Are you sure you want to delete this project?</p>

        <InputWritten
          value={title}
          type="text"
          changeFn={(e) => settitle(e)}
          name="project-title"
          label="Please enter title of the project"
        />
        <ResultDisplayer message={message} />
        <FormButton
          style="primary"
          disabled={props.project.title !== title}
          clickFn={handleClick}
          label="Submit"
        />
      </FormWrapper>
    </>
  );
};

export default DeleteProjectForm;
