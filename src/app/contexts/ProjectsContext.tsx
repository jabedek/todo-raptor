// import { createContext, useState, useEffect, useContext } from "react";
// import { Unsubscribe } from "firebase/auth";

// import { Project, ProjectWithAssigneesRegistry } from "@@types";
// import { ProjectsAPI, UsersAPI } from "@@api/firebase";
// import { useUserValue } from "./UserContext";
// import { ProjectsFullData, UnboundAssigneesRegistry } from "../types/Projects";

// type ProjectsDataValue = {
//   projectsData: ProjectsFullData;
//   clearProjects: () => void;
// };

// const ProjectsDataValue = createContext<ProjectsDataValue>({
//   projectsData: {
//     active: [],
//     archived: [],
//   },
//   clearProjects: () => {},
// });

// let UNSUB_PROJECTS: Unsubscribe | undefined = undefined;

// const ProjectsProvider = ({ children }: any) => {
//   const { user, canUseAPI } = useUserValue();
//   const [projectsData, setprojectsData] = useState<ProjectsFullData>({
//     active: [],
//     archived: [],
//   });

//   useEffect(() => {
//     unsubListener();

//     if (user && canUseAPI) {
//       ProjectsAPI.listenProjectsWithAssigneesData([...user.work.projectsIds], false, (data: ProjectsFullData, unsubFn) => {
//         UNSUB_PROJECTS = unsubFn;
//         console.log(data);
//         setprojectsData(data);
//       });
//     } else {
//       clearProjects();
//     }

//     return () => unsubListener();
//   }, [user]);

//   const unsubListener = () => {
//     if (UNSUB_PROJECTS) {
//       UNSUB_PROJECTS();
//       UNSUB_PROJECTS = undefined;
//     }
//   };

//   const clearProjects = () =>
//     setprojectsData({
//       active: [],
//       archived: [],
//     });

//   return <ProjectsDataValue.Provider value={{ projectsData, clearProjects }}>{children}</ProjectsDataValue.Provider>;
// };

// function useProjectsValue() {
//   return useContext(ProjectsDataValue);
// }

// export { ProjectsProvider, useProjectsValue };
