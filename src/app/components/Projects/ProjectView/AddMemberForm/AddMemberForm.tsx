import { ProjectsAPI } from "@@api/firebase";
import { usePopupContext } from "@@components/Layout";
import { PROJECT_ROLES_OPTIONS, ProjectRoleOption, ROLES_COLORS } from "@@components/Projects/project-roles";
import { Button } from "@@components/common";
import {
  AreYouSureDialog,
  BasicInputsTypes,
  FormWrapper,
  InputRadios,
  InputSelect,
  InputWritten,
  ResultDisplayer,
} from "@@components/forms";
import { CommonTypes, ProjectTypes, UserTypes } from "@@types";
import { useEffect, useState } from "react";

type Props = {
  user: UserTypes.User | undefined;
  project: ProjectTypes.Project | undefined;
};

const AddMemberForm: React.FC<Props> = ({ user, project }) => {
  const [member, setmember] = useState<CommonTypes.IdEmailPair>();
  const [membersOptions, setmembersOptions] = useState<BasicInputsTypes.SelectOption<CommonTypes.IdEmailPair>[]>([]);
  const [role, setrole] = useState<ProjectTypes.ProjectTeamMemberRole>();
  const [message, setmessage] = useState<CommonTypes.ResultDisplay | undefined>(undefined);

  useEffect(() => {
    if (user && project) {
      ProjectsAPI.getAvailableContactsForMembership(user, project).then((members) => {
        console.log(members);

        if (members) {
          const options: BasicInputsTypes.SelectOption<CommonTypes.IdEmailPair>[] = members.map((member) => ({
            value: member,
            label: member.email,
          }));
          setmembersOptions(options);
        }
      });
    }
  }, [user, project]);

  const submit = () => {
    if (member && role && project) {
      const roleColor = role.includes("project#") ? ROLES_COLORS["project#"] : ROLES_COLORS[role];
      const fullTeamMember: ProjectTypes.ProjectTeamMember = { ...member, role, roleColor };

      ProjectsAPI.userAsTeamMember(fullTeamMember, project, "make")
        .then((res) => {
          setmessage({ isError: false, text: "User has been added to project team." });
        })
        .catch((e) => console.error(e));
    }
  };

  return (
    <FormWrapper
      title="Add Project Member"
      tailwindStyles="w-[500px] ">
      <div className="w-full flex justify-between">
        <InputSelect
          required
          name="mode"
          selectWidth="w-[460px]"
          changeFn={(val) => setmember(val)}
          label="Select member from your contacts"
          value={member}
          options={membersOptions}
        />
      </div>

      <div className="w-full flex justify-between">
        <InputSelect
          required
          name="mode"
          selectWidth="w-[200px]"
          tailwindStyles="w-[400px]"
          changeFn={(val) => setrole(val)}
          label="Member Role"
          value={role}
          options={PROJECT_ROLES_OPTIONS}
        />
      </div>

      <ResultDisplayer message={message} />

      <Button
        formStyle="primary"
        label="Submit"
        clickFn={submit}
        disabled={!(role && member)}
      />
    </FormWrapper>
  );
};

export default AddMemberForm;
