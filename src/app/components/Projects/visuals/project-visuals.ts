import { SelectOption } from "@@components/forms";

/* ### Projects ### */
const ProjectRoleShortNames = [
  "manager",
  "product_owner",
  "vice_manager",
  "team_leader",
  "analyst",
  "designer",
  "intern",
  "coworker",
  "tester",
  "ui_designer",
  "developer",
  "spectator",
  "CUSTOM_ROLE",
] as const;

const projectRoleFullNames = [
  "Project Manager",
  "Product Owner",
  "Vice Manager",
  "Team Leader",
  "Analyst",
  "Designer",
  "Intern",
  "Coworker",
  "Tester",
  "UI/UX Designer",
  "Developer",
  "Spectator",
  "[Custom Role]",
] as const;

export type ProjectRoleShortName = (typeof ProjectRoleShortNames)[number];
type ProjectRoleFullName = (typeof projectRoleFullNames)[number];
type ProjectRoleStyleClasses = [`icon-role-${ProjectRoleShortName}`, `profile-role-${ProjectRoleShortName}`];

const customRolePrefix = "project#";

export type ProjectRole = {
  shortName: ProjectRoleShortName;
  fullName: ProjectRoleFullName;
  customRole: string | undefined;
  styleClasses: ProjectRoleStyleClasses;
};

export const PROJECT_ROLES: ProjectRole[] = projectRoleFullNames.map((fullName, i) => ({
  shortName: ProjectRoleShortNames[i],
  fullName,
  customRole: fullName === "[Custom Role]" ? customRolePrefix : undefined,
  styleClasses: [`icon-role-${ProjectRoleShortNames[i]}`, `profile-role-${ProjectRoleShortNames[i]}`],
}));

export const PROJECT_ROLES_OPTIONS: SelectOption<ProjectRoleShortName>[] = PROJECT_ROLES.map((role: ProjectRole) => {
  let option: SelectOption<ProjectRoleShortName> = {
    value: role.shortName,
    label: role.fullName,
    iconClass: role.styleClasses[0],
  };

  if (role.fullName === "[Custom Role]") {
    option = {
      ...option,
      prefix: customRolePrefix,
      customWrite: true,
    };
  }

  return option;
});

export const getProjectRoleDetails = (value: ProjectRoleShortName | undefined): ProjectRole | undefined => {
  if (!value) {
    return undefined;
  }
  return PROJECT_ROLES[ProjectRoleShortNames.findIndex((s: ProjectRoleShortName) => s === value)];
};
