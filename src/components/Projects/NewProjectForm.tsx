import { useState, useContext } from "react";
import { generateDocumentId } from "frotsi";
import { AuthContext } from "@@context/AuthDataContext";
import { Project } from "@@types/Project";
import { ProjectsAPI } from "@@services/api/projectsAPI";
import { UsersAPI } from "@@services/api/usersAPI";
import { UserFieldUpdate } from "@@types/User";
import { useUserDataValue } from "@@context/UserDataContext";
import { FormWrapper, InputWritten, InputTags, FormButton, TagItem } from "@@components/FormElements";

const NewProjectForm = () => {
  const { auth } = useContext(AuthContext);
  const { userData } = useUserDataValue();
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectTags, setProjectTags] = useState<TagItem[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    if (auth && auth.id && userData) {
      const newProject: Project = {
        id: `proj_${generateDocumentId()}`,
        title: projectTitle,
        description: projectDescription,
        tags: projectTags.map((t) => t.value),
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

      const fieldsToUpdate: UserFieldUpdate[] = [
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
        UsersAPI.updateUserFieldsById(auth.id, fieldsToUpdate).then(
          () => {},
          () => {}
        );
      });
    }
  };

  return (
    <FormWrapper
      title="New Project"
      tailwindStyles="w-[500px] min-h-[500px]">
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
        name="task-tags"
        changeFn={(val) => setProjectTags(val)}
        label="Tags"
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
