import ProjectForm from "./ProjectForm/ProjectForm";
import DeleteProjectForm from "./DeleteProjectForm/DeleteProjectForm";
import ProjectsTable from "./ProjectsTable/ProjectsTable";
import ProjectsTableHeader from "./ProjectsTable/ProjectsTableHeader/ProjectsTableHeader";
import ProjectsTableBody from "./ProjectsTable/ProjectsTableBody/ProjectsTableBody";
import ProjectsTableItem from "./ProjectsTable/ProjectsTableItem/ProjectsTableItem";
import ProjectBadge from "./ProjectsTable/ProjectsTableHeader/ProjectBadge/ProjectBadge";
import ProjectList from "./ProjectsTable/ProjectsTableItem/ProjectList/ProjectList";
import ProjectView from "./ProjectView/ProjectView";
import ProjectViewHeader from "./ProjectView/ProjectViewHeader/ProjectViewHeader";
import AssignToProjectForm from "./ProjectView/AssignToProjectForm/AssignToProjectForm";
import ProjectAssigneeIcon from "./ProjectAssigneeIcon/ProjectAssigneeIcon";
import TaskCard from "./ProjectView/tabs/ProjectSchedule/TaskCard/TaskCard";

import { getUserDisplayName } from "./projects-utils";

import * as ProjectsVisuals from "./visuals/project-visuals";

export {
  ProjectForm,
  DeleteProjectForm,
  ProjectBadge,
  ProjectList,
  //
  ProjectsTable,
  ProjectsTableHeader,
  ProjectsTableBody,
  ProjectsTableItem,
  ProjectAssigneeIcon,
  //
  ProjectView,
  ProjectViewHeader,
  AssignToProjectForm,
  TaskCard,
  //
  getUserDisplayName,
  ProjectsVisuals,
};
