import { SelectOption } from "@@components/common";

/* ### Projects ### */
const ProjectRoleShortNames = [
  "manager", // only 1 per project but can be changed
  "product_owner", // only 1 per project and can not be changed
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

  if (value.includes(customRolePrefix)) {
    value = "CUSTOM_ROLE";
  }

  return PROJECT_ROLES[ProjectRoleShortNames.findIndex((s: ProjectRoleShortName) => s === value)];
};

const projectStatuses = ["active", "completed", "cancelled"] as const;
export type ProjectStatusName = (typeof projectStatuses)[number];
type ProjectStatusStyleClasses = [`project-status-${ProjectStatusName}`, `project-status-bg-${ProjectStatusName}`];

export type ProjectStatusClass = ProjectStatusStyleClasses[number];

export type ProjectStatus = {
  shortName: ProjectStatusName;
  styleClasses: ProjectStatusStyleClasses;
};
export const PROJECT_STATUSES: ProjectStatus[] = projectStatuses.map((shortName) => ({
  shortName,
  styleClasses: [`project-status-${shortName}`, `project-status-bg-${shortName}`],
}));

export const PROJECT_STATUSES_OPTIONS: SelectOption<ProjectStatusName>[] = PROJECT_STATUSES.map((status: ProjectStatus) => ({
  value: status.shortName,
  label: status.shortName.toUpperCase(),
  iconClass: status.styleClasses[0],
}));

export const getProjectStatusDetails = (value: ProjectStatusName): ProjectStatus =>
  PROJECT_STATUSES[projectStatuses.findIndex((s: ProjectStatusName) => s === value)];
