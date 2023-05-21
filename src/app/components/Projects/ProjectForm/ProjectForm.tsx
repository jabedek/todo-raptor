import { useState, useEffect } from "react";
import { generateDocumentId, generateInputId } from "frotsi";

import { Project, SimpleProjectAssignee, ScheduleColumn, ScheduleColumns, UserFieldUpdate, User } from "@@types";
import { ProjectsAPI, UsersAPI } from "@@api/firebase";
import { useUserValue } from "@@contexts";
import { ConfirmDialog, FormWrapper, InputTags, InputWritten, ResultDisplay, TagItem } from "@@components/forms";
import { usePopupContext } from "@@components/Layout";
import { Button } from "@@components/common";
import { getScheduleColumnsEmpty } from "../projects-utils";
import { ProjectWithAssigneesRegistry, Schedule, SimpleColumn } from "src/app/types/Projects";
import { useNavigate } from "react-router-dom";

type Props = {
  project?: ProjectWithAssigneesRegistry | undefined;
};

const ProjectForm: React.FC<Props> = ({ project }) => {
  const { user } = useUserValue();
  const [projectTitle, setprojectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectTags, setprojectTags] = useState<TagItem[]>([]);

  const [projectManager, setprojectManager] = useState<TagItem[]>([]);

  const [message, setmessage] = useState<ResultDisplay>();
  const [formMode, setformMode] = useState<"new" | "edit">("new");
  const { showPopup, hidePopup } = usePopupContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (project) {
      setformMode("edit");
      setprojectTitle(project.title);
      setProjectDescription(project.description);
      setprojectTags(project.tags.map((value) => ({ value, temporaryId: generateInputId("project-tags", "tag") })));
    } else {
      setformMode("new");
    }
  }, [project]);

  const popupConfirmDialog = (fullProject: ProjectWithAssigneesRegistry, action: "delete" | "archive") => {
    const { assigneesRegistry, ...project } = fullProject;
    const whatAction = action === "delete" ? "delete project and archive related tasks" : "archive project and related tasks";
    const extraAction =
      action === "delete" ? "what to do with tasks - only archive (not checked) or delete (checked)?" : undefined;

    showPopup(
      <ConfirmDialog
        submitFn={(deleteTasks) => (action === "delete" ? deleteProject(project, deleteTasks) : archiveProject(project))}
        whatAction={whatAction}
        irreversible={true}
        extraActionCheck={extraAction}
        closeOnSuccess={true}
      />
    );
  };

  const deleteProject = (data: Project, deleteTasks: boolean) => {
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

  const archiveProject = (data: Project) => {
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

  const handleSubmitNewProject = async () => {
    const userId = user?.authentication.id;
    const userEmail = user?.authentication.email;
    if (userId && userEmail) {
      const manager: SimpleProjectAssignee = {
        id: userId,
        email: userEmail,
        role: "manager",
      };
      const projectId = `proj_${generateDocumentId()}`;
      const scheduleId = `sche_${generateDocumentId()}`;
      const newProject: Project = {
        id: projectId,
        title: projectTitle,
        description: projectDescription,
        tags: [...projectTags.map((t) => t.value)],
        originalCreatorId: userId,
        managerId: userId,
        assignees: [manager],
        tasksLists: {
          archive: [],
          backlog: [],
          scheduleId,
        },
        tasksCounter: 0,
        status: "active",
        archived: false,
        createdAt: new Date().toISOString(),
        closedAt: "",
      };
      const newSchedule: Schedule<SimpleColumn> = {
        id: scheduleId,
        projectId,
        columns: getScheduleColumnsEmpty("simple"),
      };

      saveProject(newProject, newSchedule, user);
    }
  };

  const handleSubmitEditProject = async () => {
    const userId = user?.authentication.id;
    const userEmail = user?.authentication.email;
    if (userId && userEmail) {
      const manager: SimpleProjectAssignee = {
        id: userId,
        email: userEmail,
        role: "manager",
      };
      const projectId = `proj_${generateDocumentId()}`;
      const scheduleId = `sche_${generateDocumentId()}`;
      const newProject: Project = {
        id: projectId,
        title: projectTitle,
        description: projectDescription,
        tags: [...projectTags.map((t) => t.value)],
        originalCreatorId: userId,
        managerId: userId,
        assignees: [manager],
        tasksLists: {
          archive: [],
          backlog: [],
          scheduleId,
        },
        tasksCounter: 0,
        status: "active",
        archived: false,
        createdAt: new Date().toISOString(),
        closedAt: "",
      };
      const newSchedule: Schedule<SimpleColumn> = {
        id: scheduleId,
        projectId,
        columns: getScheduleColumnsEmpty("simple"),
      };
    }
  };

  const handleSubmit = () => {
    if (formMode === "new") {
      handleSubmitNewProject();
    } else {
      handleSubmitEditProject();
    }
  };

  const saveProject = async (newProject: Project, newSchedule: Schedule<SimpleColumn>, user: User) => {
    const fieldsToUpdate: UserFieldUpdate[] = [
      {
        fieldPath: "work.projectsIds",
        value: [...user.work.projectsIds, newProject.id],
      },
    ];

    ProjectsAPI.saveNewProject(newProject, newSchedule).then(() => {
      clear();

      UsersAPI.updateUserFieldsById(user.authentication.id, fieldsToUpdate).then(
        () => {
          clear();
          hidePopup();
        },
        () => {}
      );
    });
  };

  const clear = () => {
    setprojectTitle("");
    setProjectDescription("");
    setprojectTags([]);
  };

  return (
    <FormWrapper
      title="New Project"
      submitFn={handleSubmitNewProject}
      tailwindStyles="w-[500px] min-h-[500px]">
      <InputWritten
        required
        type="text"
        name="project-title"
        changeFn={(val) => setprojectTitle(val)}
        label="Project Title"
        value={projectTitle}
        autoComplete="on"
        tailwindStyles="min-w-[250px] w-full"
      />

      <InputWritten
        required
        type="text"
        name="project-name"
        changeFn={(val) => setProjectDescription(val)}
        label="Project Description"
        value={projectDescription}
        autoComplete="on"
        tailwindStyles="min-w-[250px] w-full"
      />

      <InputTags
        required
        name="project-tags"
        changeFn={(val) => setprojectTags(val)}
        label="Tags"
        hint="Tags could be used to describe project. They can describe main area(s), reasons, goals, contextual informations, used tools."
        values={projectTags}
        disabled={projectTags.length === 5}
      />

      <div className="flex w-full justify-center gap-3 items-center">
        <Button
          clickFn={handleSubmit}
          formStyle="primary"
          label="Submit"
        />

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
