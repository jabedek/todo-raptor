import { useEffect, useState } from "react";
import { ProjectsAPI } from "@@api/firebase";
import { Button } from "@@components/common";
import { FormWrapper, InputSelect, ResultDisplay, ResultDisplayer, SelectOption } from "@@components/forms";
import { IdEmailPair, Project, User } from "@@types";
import { ProjectsVisuals } from "@@components/Projects";

type Props = {
  user: User | undefined;
  project: Project | undefined;
};

const AssignToProjectForm: React.FC<Props> = ({ user, project }) => {
  const [assignee, setassignee] = useState<IdEmailPair>();
  const [assigneesOptions, setassigneesOptions] = useState<SelectOption<IdEmailPair>[]>([]);
  const [role, setrole] = useState<ProjectsVisuals.ProjectRoleShortName>();
  const [message, setmessage] = useState<ResultDisplay | undefined>(undefined);

  useEffect(() => {
    if (user && project) {
      ProjectsAPI.getAvailableContactsForAssigneeship(user, project).then((assignees) => {
        if (assignees) {
          const options: SelectOption<IdEmailPair>[] = assignees.map((assignee) => ({
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
          options={ProjectsVisuals.PROJECT_ROLES_OPTIONS}
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
