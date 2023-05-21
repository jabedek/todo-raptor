import { useState } from "react";
import { generateDocumentId } from "frotsi";

import { Project, SimpleProjectAssignee, ScheduleColumn, ScheduleColumns, UserFieldUpdate } from "@@types";
import { ProjectsAPI, UsersAPI } from "@@api/firebase";
import { useUserValue } from "@@contexts";
import { FormWrapper, InputTags, InputWritten, TagItem } from "@@components/forms";
import { usePopupContext } from "@@components/Layout";
import { Button } from "@@components/common";
import { getScheduleColumnsEmpty } from "../projects-utils";
import { Schedule, SimpleColumn } from "src/app/types/Projects";

const NewProjectForm: React.FC = () => {
  const { user } = useUserValue();
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectTags, setProjectTags] = useState<TagItem[]>([]);
  const { hidePopup } = usePopupContext();

  const handleSubmit = async (e: React.FormEvent) => {
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

      const fieldsToUpdate: UserFieldUpdate[] = [
        {
          fieldPath: "work.projectsIds",
          value: [...user.work.projectsIds, newProject.id],
        },
      ];

      ProjectsAPI.saveNewProject(newProject, newSchedule).then(() => {
        clear();

        UsersAPI.updateUserFieldsById(userId, fieldsToUpdate).then(
          () => {
            clear();
            hidePopup();
          },
          () => {}
        );
      });
    }
  };

  const clear = () => {
    setProjectTitle("");
    setProjectDescription("");
    setProjectTags([]);
  };

  return (
    <FormWrapper
      title="New Project"
      submitFn={handleSubmit}
      tailwindStyles="w-[500px] min-h-[500px]">
      <InputWritten
        required
        type="text"
        name="project-title"
        changeFn={(val) => setProjectTitle(val)}
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
        changeFn={(val) => setProjectTags(val)}
        label="Tags"
        hint="Tags could be used to describe project. They can describe main area(s), reasons, goals, contextual informations, used tools."
        values={projectTags}
        disabled={projectTags.length === 5}
      />

      <Button
        clickFn={handleSubmit}
        formStyle="primary"
        label="Submit"
      />
    </FormWrapper>
  );
};

export default NewProjectForm;
