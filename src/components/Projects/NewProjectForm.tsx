// import { useState, useContext } from "react";
// import { useAuth } from "@@hooks/useAuth";
// import { firestore } from "@@firebase";
// import { Project, User } from "@@types";
// import { generateDocumentId } from "frotsi";
// import { AuthContext, useAuthValue } from "@@context/AuthContext";

// const NewProjectForm = () => {
//   const { user, putAuth } = useContext(AuthContext);
//   const [projectName, setProjectName] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!user) {
//       return;
//     }

//     const projectId = generateDocumentId();

//     const newProject: Project = {
//       id: projectId,
//       name: projectName,
//       manager: { id: user.id, displayName: user.displayName },
//       assignees: [],
//       tasksIds: [],
//     };

//     try {
//       // Add the new project to the "projects" collection in Cloud Firestore
//       await firestore.collection("projects").doc(projectId).set(newProject);

//       // Add the new project ID to the user's "projectsIds" field
//       const updatedUser: User = { ...user, projectsIds: [...user.projectsIds, projectId] };
//       await firestore.collection("users").doc(user.id).update(updatedUser);

//       // Update the local user object
//       putAuth(updatedUser);

//       // Clear the form
//       setProjectName("");
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <label htmlFor="projectName">Project Name:</label>
//       <input
//         type="text"
//         id="projectName"
//         value={projectName}
//         onChange={(e) => setProjectName(e.target.value)}
//         required
//       />
//       <button type="submit">Create Project</button>
//     </form>
//   );
// };
