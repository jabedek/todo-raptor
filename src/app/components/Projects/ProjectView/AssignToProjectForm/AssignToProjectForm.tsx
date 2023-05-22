import { useEffect, useState } from "react";
import { ProjectsAPI } from "@@api/firebase";
import { Button } from "@@components/common";
import { FormWrapper, InputSelect, ResultDisplay, ResultDisplayer, SelectOption } from "@@components/forms";
import { IdEmailPair, ProjectWithAssigneesRegistry, User } from "@@types";
import { PROJECT_ROLES_OPTIONS, ProjectRoleShortName } from "@@components/Projects/visuals/project-visuals";
type Props = {
  user: User | undefined;
  project: ProjectWithAssigneesRegistry | undefined;
};

const AssignToProjectForm: React.FC<Props> = ({ user, project }) => {
  const [assignee, setassignee] = useState<IdEmailPair>();
  const [assigneesOptions, setassigneesOptions] = useState<SelectOption<IdEmailPair>[]>([]);
  const [role, setrole] = useState<ProjectRoleShortName>();
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
      tailwindStyles="w-[500px] min-h-[400px] ">
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
          options={PROJECT_ROLES_OPTIONS.filter((o) => !["manager", "product_owner"].includes(o.value))}
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
