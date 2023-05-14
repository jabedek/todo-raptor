import { BasicInputsTypes } from "@@components/forms";
import { ProjectTypes } from "@@types";

export type ProjectRoleOption = BasicInputsTypes.SelectOption<ProjectTypes.ProjectTeamMemberRole>;

export const PROJECT_ROLES_OPTIONS: ProjectRoleOption[] = [
  { label: "Project Manager", value: "manager", iconClass: "project-role-color-1" },
  { label: "Product Owner", value: "product-owner", iconClass: "project-role-color-1" },
  { label: "Vice Manager", value: "vice-manager", iconClass: "project-role-color-1" },
  //
  { label: "Team Leader", value: "team-leader", iconClass: "project-role-color-2" },
  ///
  { label: "Analyst", value: "analyst", iconClass: "project-role-color-3" },
  { label: "Designer", value: "designer", iconClass: "project-role-color-3" },
  //
  { label: "Intern", value: "intern", iconClass: "project-role-color-4" },
  { label: "Coworker", value: "coworker", iconClass: "project-role-color-4" }, // generic
  //
  { label: "Tester", value: "tester", iconClass: "project-role-color-5" },
  //
  { label: "UI/UX Designer", value: "ui-designer", iconClass: "project-role-color-6" },
  //
  { label: "Developer", value: "developer", iconClass: "project-role-color-7" },
  //
  { label: "Spectator", value: "spectator", iconClass: "project-role-color-8" },
  ///
  {
    label: "[Custom Role]",
    value: "" as ProjectTypes.ProjectTeamMemberRole,
    iconClass: "project-role-color-9",
    prefix: "project#",
    customWrite: true,
  }, // custom,
];

export const ROLES_COLORS: Record<ProjectTypes.ProjectTeamMemberRole, string> = {
  manager: "project-role-bgcolor-1",
  "product-owner": "project-role-bgcolor-1",
  "vice-manager": "project-role-bgcolor-1",
  //
  "team-leader": "project-role-bgcolor-2",
  //
  analyst: "project-role-bgcolor-3",
  designer: "project-role-bgcolor-3",
  //
  intern: "project-role-bgcolor-4",
  coworker: "project-role-bgcolor-4",
  //
  tester: "project-role-bgcolor-5",
  //
  "ui-designer": "project-role-bgcolor-6",
  //
  developer: "project-role-bgcolor-7",
  //
  spectator: "project-role-bgcolor-8",
  //
  "project#": "project-role-bgcolor-9",
};
