import { ProjectsAPI } from "@@api/firebase";
import {
  PROJECT_ROLES_OPTIONS,
  ProjectRole,
  ProjectRoleShortName,
} from "@@components/RolesStatusesVisuals/roles-statuses-visuals";
import { Button } from "@@components/common";
import { BasicInputsTypes, FormWrapper, InputSelect, ResultDisplayer } from "@@components/forms";
import { CommonTypes, ProjectTypes, UserTypes } from "@@types";
import { useEffect, useState } from "react";

type Props = {
  user: UserTypes.User | undefined;
  project: ProjectTypes.Project | undefined;
};

const AssignToProjectForm: React.FC<Props> = ({ user, project }) => {
  const [assignee, setassignee] = useState<CommonTypes.IdEmailPair>();
  const [assigneesOptions, setassigneesOptions] = useState<BasicInputsTypes.SelectOption<CommonTypes.IdEmailPair>[]>([]);
  const [role, setrole] = useState<ProjectRoleShortName>();
  const [message, setmessage] = useState<CommonTypes.ResultDisplay | undefined>(undefined);

  useEffect(() => {
    if (user && project) {
      ProjectsAPI.getAvailableContactsForAssigneeship(user, project).then((assignees) => {
        if (assignees) {
          const options: BasicInputsTypes.SelectOption<CommonTypes.IdEmailPair>[] = assignees.map((assignee) => ({
            value: assignee,
            label: assignee.email,
          }));
          setassigneesOptions(options);
        }
      });
    }
  }, [user, project]);

  const submit = () => {
    if (assignee && role && project) {
      ProjectsAPI.userAsAssigneeBond({ ...assignee, role }, project, "make")
        .then(() => setmessage({ isError: false, text: "User has been added to project team." }))
        .catch((e) => console.error(e));
    }
  };

  return (
    <FormWrapper
      title="Add Project Assignee"
      tailwindStyles="w-[500px] ">
      <div className="w-full flex justify-between">
        <InputSelect
          required
          name="mode"
          selectWidth="w-[460px]"
          changeFn={(val) => setassignee(val)}
          label="Select assignee from your contacts"
          value={assignee}
          options={assigneesOptions}
        />
      </div>

      <div className="w-full flex justify-between">
        <InputSelect
          required
          name="mode"
          selectWidth="w-[200px]"
          tailwindStyles="w-[400px]"
          changeFn={(val) => setrole(val)}
          label="Assignee Role"
          value={role}
          disabled={!assignee}
          options={PROJECT_ROLES_OPTIONS}
        />
      </div>

      <ResultDisplayer message={message} />

      <Button
        formStyle="primary"
        label="Submit"
        clickFn={submit}
        disabled={!(role && assignee)}
      />
    </FormWrapper>
  );
};

export default AssignToProjectForm;
