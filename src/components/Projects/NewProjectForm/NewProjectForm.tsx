import { useState } from "react";
import { generateDocumentId } from "frotsi";

import { ProjectTypes, UserTypes } from "@@types";
import { ProjectsAPI, UsersAPI } from "@@api";
import { useAuthDataValue, useUserDataValue } from "@@context";
import { FormWrapper, InputWritten, InputTags, FormButton, InputTagsTypes } from "@@components/FormElements";
import RenderObject from "@@components/common/RenderObject/RenderObject";

const NewProjectForm: React.FC = () => {
  const { auth } = useAuthDataValue();
  const { userData } = useUserDataValue();
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectTags, setProjectTags] = useState<InputTagsTypes.TagItem[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    if (auth && auth.id && userData) {
      const newProject: ProjectTypes.Project = {
        id: `proj_${generateDocumentId()}`,
        title: projectTitle,
        description: projectDescription,
        tags: [...projectTags.map((t) => t.value)],
        manager: { id: auth.id, displayName: auth.displayName, email: auth.email },
        originalCreatorId: auth.id,
        teamMembers: [{ userId: auth.id, role: "manager" }],
        tasksIds: [],
        status: "active",
        createdAt: new Date().toISOString(),
        visuals: {
          colorPrimary: "",
          colorSecondary: "",
          colorTertiary: "",
        },
      };

      const fieldsToUpdate: UserTypes.UserFieldUpdate[] = [
        {
          fieldPath: "userData.workDetails.projects.projectsIdsManaged",
          value: [...userData.workDetails.projects.projectsIdsManaged, newProject.id],
        },
        {
          fieldPath: "userData.workDetails.projects.projectsIdsWorking",
          value: [...userData.workDetails.projects.projectsIdsWorking, newProject.id],
        },
        {
          fieldPath: "userData.workDetails.projects.projectsIdsCreated",
          value: [...userData.workDetails.projects.projectsIdsCreated, newProject.id],
        },
      ];

      ProjectsAPI.saveNewProject(newProject).then(() => {
        clear();
        UsersAPI.updateUserFieldsById(auth.id, fieldsToUpdate).then(
          () => {},
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
      <RenderObject data={projectTags} />
      <InputWritten
        required
        type="text"
        name="project-title"
        changeFn={(val) => setProjectTitle(val)}
        label="Project Title"
        value={projectTitle}
        autoComplete="on"
      />

      <InputWritten
        required
        type="text"
        name="project-name"
        changeFn={(val) => setProjectDescription(val)}
        label="Project Description"
        value={projectDescription}
        autoComplete="on"
      />

      <InputTags
        required
        name="project-tags"
        changeFn={(val) => setProjectTags(val)}
        label="Tags"
        hint="Tags could be used to describe project. They can describe main area(s), reasons, goals, contextual informations, used tools."
        values={projectTags}
      />

      <FormButton
        clickFn={handleSubmit}
        style="primary"
        label="Submit"
      />
    </FormWrapper>
  );
};

export default NewProjectForm;
