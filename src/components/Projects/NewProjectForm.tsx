import { useState, useContext } from "react";

import { generateDocumentId } from "frotsi";
import { AuthContext, useAuthValue } from "@@context/AuthContext";
import { Project } from "@@types/Project";
import { ProjectsAPI } from "@@services/api/projectsAPI";
import { FormButton, FormWrapper, InputWritten } from "@@components/FormElements";
import { UsersAPI } from "@@services/api/usersAPI";
import { User, UserData, UserFieldUpdate } from "@@types/User";

const NewProjectForm = () => {
  const { user } = useContext(AuthContext);
  const [projectName, setProjectName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    if (!user || !user.id) {
      return;
    }

    const newProject: Project = {
      id: `proj_${generateDocumentId()}`,
      name: projectName,
      manager: { id: user.id, displayName: user.displayName, email: user.email },
      originalCreatorId: user.id,
      assigneesIds: [],
      tasksIds: [],
    };

    const newProjectsIdsManaged: string[] = [...user.userData.projects.projectsIdsManaged, newProject.id];
    const newProjectsIdsWorking: string[] = [...user.userData.projects.projectsIdsWorking, newProject.id];
    const newProjectsIdsCreated: string[] = [...user.userData.projects.projectsIdsCreated, newProject.id];

    const fieldsToUpdate: UserFieldUpdate[] = [
      { fieldPath: "userData.projects.projectsIdsManaged", value: newProjectsIdsManaged },
      { fieldPath: "userData.projects.projectsIdsWorking", value: newProjectsIdsWorking },
      { fieldPath: "userData.projects.projectsIdsCreated", value: newProjectsIdsCreated },
    ];

    ProjectsAPI.saveNewProject(newProject).then(() => {
      UsersAPI.updateUserFieldsById(user.id, fieldsToUpdate).then(
        () => {
          // putAuth()
        },
        () => {}
      );
    });
  };

  return (
    <FormWrapper
      title="New Project"
      tailwindStyles="w-[500px] min-h-[250px]">
      <InputWritten
        required
        type="text"
        name="project-name"
        onChange={(val) => setProjectName(val)}
        label="Project Name"
        value={projectName}
        autoComplete="on"
      />
      <FormButton
        action={handleSubmit}
        style="primary"
        label="Submit"
      />
    </FormWrapper>
  );
};

export default NewProjectForm;
