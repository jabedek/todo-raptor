import { useEffect, useLayoutEffect, useState } from "react";
import { generateDocumentId, generateInputId } from "frotsi";

import { Project, SimpleAssignee, User, UserFieldUpdate } from "@@types";
import { ProjectsAPI, UsersAPI } from "@@api/firebase";
import { useUserValue } from "@@contexts";
import {
  ConfirmDialog,
  FormWrapper,
  InputSelect,
  InputTags,
  InputWritten,
  ResultDisplay,
  ResultDisplayer,
  SelectOption,
  TagItem,
} from "@@components/forms";
import { usePopupContext } from "@@components/Layout";
import { Button } from "@@components/common";
import { getScheduleColumnsEmpty } from "../projects-utils";
import { ProjectWithAssigneesRegistry } from "src/app/types/Projects";
import { useNavigate } from "react-router-dom";
import {
  PROJECT_ROLES_OPTIONS,
  PROJECT_STATUSES_OPTIONS,
  ProjectRoleShortName,
  ProjectStatusName,
} from "../visuals/project-visuals";
import { getShortId } from "@@components/Tasks/task-utils";
import { Schedule, SimpleColumn } from "src/app/types/Schedule";
import { WrittenChangeEvent } from "@@components/forms/components/basic-inputs/types";

type Props = {
  project?: ProjectWithAssigneesRegistry | undefined;
};

const ProjectForm: React.FC<Props> = ({ project }) => {
  type Option = SelectOption<SimpleAssignee>;
  const { user } = useUserValue();
  const [projectTitle, setprojectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectTags, setprojectTags] = useState<TagItem[]>([]);
  const [status, setstatus] = useState<ProjectStatusName>(PROJECT_STATUSES_OPTIONS[0].value);
  const [id, setid] = useState("");

  const [projectManager, setprojectManager] = useState<SimpleAssignee>();
  const [projectManagerOptions, setprojectManagerOptions] = useState<Option[]>([]);

  const [message, setmessage] = useState<ResultDisplay>();
  const [formMode, setformMode] = useState<"new" | "edit">("new");
  const { showPopup, hidePopup } = usePopupContext();
  const navigate = useNavigate();

  const [userWillLoseEditingRole, setuserWillLoseEditingRole] = useState(false);
  const [userNewRole, setuserNewRole] = useState<ProjectRoleShortName>();

  useEffect(() => {
    if (formMode === "edit" && project && user) {
      const status = PROJECT_STATUSES_OPTIONS.find(({ value }) => value === project.status) || PROJECT_STATUSES_OPTIONS[0];
      setstatus(status.value);

      const currentManager = project.managerId;
      const newManager = projectManager?.id;
      setuserWillLoseEditingRole(currentManager !== newManager);
    }
  }, [projectManager]);

  useEffect(() => {
    if (project) {
      const { names, roleDetails, ...simpleManager } = project.assigneesRegistry[project.managerId];
      const manager: SimpleAssignee = simpleManager;
      setformMode("edit");
      setprojectTitle(project.title);
      setprojectManager(manager);
      setid(project.id);
      setProjectDescription(project.description);
      setprojectTags(project.tags.map((value) => ({ value, temporaryId: generateInputId("project-tags", "tag") })));
    } else {
      setformMode("new");

      setid(`proj_${generateDocumentId()}`);
    }
  }, [project]);

  useLayoutEffect(() => {
    if (user) {
      const options: SelectOption<SimpleAssignee>[] = getAssigneesOptions(user, project);
      setprojectManagerOptions(options);

      if (formMode === "new") {
        setprojectManager(options[0].value);
      }

      if (formMode === "edit" && project) {
        setprojectManager(options.find(({ value }) => value.id === `${project.managerId}`)?.value ?? undefined);
      }
    }
  }, [formMode, user]);

  const getAssigneesOptions = (user: User, project?: ProjectWithAssigneesRegistry): Option[] => {
    let options: Option[] = [];

    if (!project) {
      options = [
        {
          label: user.authentication.email,
          value: {
            id: user.authentication.id,
            email: user.authentication.email,
            role: "manager",
          },
        },
      ];
    } else {
      options = project.assignees.map((assignee) => ({
        label: `${assignee.email}`,
        value: { ...assignee, email: `${assignee.email}` },
      }));
    }

    return options;
  };

  const popupConfirmDialog = (fullProject: ProjectWithAssigneesRegistry, action: "delete" | "archive"): void => {
    const { assigneesRegistry, ...project } = fullProject;
    const whatAction = action === "delete" ? "delete project and archive related tasks" : "archive project and related tasks";
    const extraAction =
      action === "delete" ? "what to do with tasks - only archive (not checked) or delete (checked)?" : undefined;

    showPopup(
      <ConfirmDialog
        submitFn={(deleteTasks: boolean) => (action === "delete" ? deleteProject(project, deleteTasks) : archiveProject(project))}
        whatAction={whatAction}
        irreversible={true}
        extraActionCheck={extraAction}
        closeOnSuccess={true}
      />
    );
  };

  const deleteProject = (data: Project, deleteTasks: boolean): void => {
    if (data) {
      ProjectsAPI.deleteProjectCompletely(data, deleteTasks)
        .then(() => setmessage({ text: "Project and tasks have been deleted. Users data updated.", isError: false }))
        .catch((e) => {
          console.error(e);
          setmessage({ isError: true, text: "Error during deleting project. See console." });
        })
        .finally(() => {
          navigate("/projects");
        });
    }
  };

  const archiveProject = (data: Project): void => {
    if (data) {
      ProjectsAPI.archiveProjectCompletely(data)
        .then(() => setmessage({ text: "Project and tasks have been archived. Users data updated.", isError: false }))
        .catch((e) => {
          console.error(e);
          setmessage({ isError: true, text: "Error during archiving project. See console." });
        })
        .finally(() => {
          navigate("/projects");
        });
    }
  };

  const handleSubmitNewProject = (): void => {
    const userId = user?.authentication.id;
    if (userId && projectManager) {
      const scheduleId = `sche_${generateDocumentId()}`;
      const newProject: Project = {
        id: id,
        title: projectTitle,
        description: projectDescription,
        tags: [...projectTags.map((t) => t.value)],
        originalCreatorId: userId,
        managerId: projectManager?.id,
        productOwnerId: userId,
        assignees: [projectManager],
        tasksLists: {
          backlog: [],
          scheduleId,
        },
        tasksCounter: 0,
        status,
        archived: false,
        createdAt: new Date().toISOString(),
        closedAt: "",
      };
      const newSchedule: Schedule<SimpleColumn> = {
        id: scheduleId,
        projectId: newProject.id,
        columns: getScheduleColumnsEmpty("simple"),
      };

      saveNewProject(newProject, newSchedule, user);
    }
  };

  const handleSubmitEditProject = (): void => {
    if (project && projectManager) {
      const newProject: Project = {
        id: project.id,
        title: projectTitle,
        description: projectDescription,
        tags: [...projectTags.map((t) => t.value)],
        originalCreatorId: project.originalCreatorId,
        productOwnerId: project.originalCreatorId || "",
        managerId: projectManager?.id,
        assignees: project.assignees,
        tasksLists: { ...project.tasksLists },
        tasksCounter: project.tasksCounter,
        status,
        archived: false,
        createdAt: project.createdAt,
        closedAt: "",
      };

      if (status !== "active") {
        newProject.closedAt = new Date().toISOString();
      }

      updateProject(newProject);
    }
  };

  const updateProject = (updatedProject: Project): void => {
    if (userNewRole && project) {
      const newCurrentUser = updatedProject.assignees.find((a) => a.id === project.managerId);
      const newManager = updatedProject.assignees.find((a) => a.id === updatedProject.managerId);

      if (newCurrentUser && newManager) {
        newCurrentUser.role = userNewRole;
        newManager.role = "manager";
      }
    }

    ProjectsAPI.updateProject(updatedProject).then(
      () => {
        clear();
        hidePopup();
      },
      () => {}
    );
  };

  const saveNewProject = (newProject: Project, newSchedule: Schedule<SimpleColumn>, user: User): void => {
    const fieldsToUpdate: UserFieldUpdate[] = [
      {
        fieldPath: "work.projectsIds",
        value: [...user.work.projectsIds, newProject.id],
      },
    ];

    ProjectsAPI.saveNewProject(newProject, newSchedule)
      .then(() => {
        clear();

        UsersAPI.updateUserFieldsById(user.authentication.id, fieldsToUpdate)
          .then(() => {
            clear();
            hidePopup();
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  };

  const handleSubmit = (): void => {
    if (formMode === "new") {
      handleSubmitNewProject();
    } else {
      handleSubmitEditProject();
    }
  };

  const resetForm = (): void => {
    setid(`proj_${generateDocumentId()}`);
    setprojectManager(undefined);
    setprojectTitle("");
    setProjectDescription("");
    setprojectTags([]);
  };

  const clear = (): void => {
    setprojectTitle("");
    setProjectDescription("");
    setprojectTags([]);
  };

  return (
    <FormWrapper
      title={`${formMode === "new" ? "Create project" : `Editing project: #${project?.title}`}`}
      submitFn={handleSubmitNewProject}
      tailwindStyles="w-[500px] min-h-[600px] max-h-[900px]">
      <p className=" w-fit text-[10px] my-2 text-gray-500 font-app_mono flex items-end">{getShortId(id)}</p>
      <InputWritten
        required
        type="text"
        name="project-title"
        changeFn={(event: WrittenChangeEvent, val: string) => setprojectTitle(val)}
        label="Project Title"
        value={projectTitle}
        autoComplete="on"
        tailwindStyles="min-w-[250px] w-full"
      />

      <InputSelect
        required
        name="project-status"
        selectWidth="w-[460px]"
        changeFn={(value: ProjectStatusName) => setstatus(value)}
        label="Status"
        value={status}
        options={formMode === "edit" ? PROJECT_STATUSES_OPTIONS : [PROJECT_STATUSES_OPTIONS[0]]}
      />

      <InputWritten
        required
        type="text"
        name="project-name"
        changeFn={(event: WrittenChangeEvent, val: string) => setProjectDescription(val)}
        label="Project Description"
        value={projectDescription}
        autoComplete="on"
        tailwindStyles="min-w-[250px] w-full"
      />

      <InputSelect
        required
        name="manager"
        selectWidth="w-[460px]"
        changeFn={(val: SimpleAssignee) => setprojectManager(val)}
        label="Assign manager"
        value={projectManager}
        options={projectManagerOptions}
      />

      {userWillLoseEditingRole && (
        <div className="h-[100px] max-h-fit">
          <InputSelect
            required={userWillLoseEditingRole}
            name="new-role"
            selectWidth="w-[460px]"
            changeFn={(val: ProjectRoleShortName) => setuserNewRole(val)}
            label="New Role"
            value={userNewRole}
            options={PROJECT_ROLES_OPTIONS.filter((o) => !["manager", "product_owner"].includes(o.value))}
          />
        </div>
      )}

      <InputTags
        required
        name="project-tags"
        changeFn={(val) => setprojectTags(val)}
        label="Tags"
        hint="Tags could be used to describe project. They can describe main area(s), reasons, goals, contextual informations, used tools."
        values={projectTags}
        disabled={projectTags.length === 5}
      />

      <ResultDisplayer message={message} />

      <div className="flex w-full justify-center gap-3 items-center">
        <Button
          clickFn={handleSubmit}
          formStyle="primary"
          disabled={!(projectTitle && status && projectDescription && projectManager)}
          label="Submit"
        />

        {formMode === "new" && (
          <Button
            formStyle="secondary"
            clickFn={resetForm}>
            Clear
          </Button>
        )}

        {formMode === "edit" && (
          <>
            <Button
              formStyle="secondary"
              clickFn={() => project && popupConfirmDialog(project, "delete")}>
              Delete
            </Button>
            <Button
              formStyle="secondary"
              clickFn={() => project && popupConfirmDialog(project, "archive")}>
              Archive
            </Button>
          </>
        )}
      </div>
    </FormWrapper>
  );
};

export default ProjectForm;
