import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Unsubscribe } from "firebase/auth";

import { UserTypes, ProjectTypes } from "@@types";
import { ListenersAPI, UsersAPI } from "@@api";
import { useAuthDataValue } from "./AuthDataContext";

type UserDataContext = {
  userData: UserTypes.UserData | undefined;
  projectsData: ProjectTypes.Project[];
  clearUserAndProjectsData: () => void;
};

const UserDataContext = createContext<UserDataContext>({
  userData: undefined,
  projectsData: [],
  clearUserAndProjectsData: () => {},
});

const Unsubscribes = new Map<string, Unsubscribe>();

const UserDetailsProvider = ({ children }: any) => {
  const [userData, setuserDetails] = useState<UserTypes.UserData | undefined>(undefined);
  const [projectsData, setprojectsData] = useState<ProjectTypes.Project[]>([]);
  const { auth } = useAuthDataValue();

  const navigate = useNavigate();

  useEffect(() => {
    if (auth) {
      UsersAPI.getUserDetailsById(auth.id).then((user: UserTypes.User | undefined) => {
        if (user) {
          const details: UserTypes.UserData = {
            workDetails: user.userData.workDetails,
            verificationDetails: user.userData.verificationDetails,
            visuals: user.userData?.visuals || { colorPrimary: "", colorSecondary: "", colorTertiary: "" },
          };

          setTimeout(() => navigate("/account", { relative: "route" }), 500);
          putUserDetails(details);

          ListenersAPI.listenToAuthUserData(auth.id, (data: UserTypes.User, unsub1) => {
            Unsubscribes.set("listenToAuthUserData", unsub1);
            if (data) {
              putUserDetails(data.userData);
            }
          });

          ListenersAPI.listenToAuthProjectsData(auth.id, [], (data: ProjectTypes.Project[], unsub1) => {
            Unsubscribes.set("listenToAuthProjectsData", unsub1);
            if (data) {
              setprojectsData(data);
            }
          });
        } else {
          clearUserAndProjectsData();
        }
      });
    }

    return () => {
      Unsubscribes.forEach((unsub, key) => {
        unsub();
        Unsubscribes.delete(key);
      });
    };
  }, [auth]);

  const putUserDetails = (userData: UserTypes.UserData) => setuserDetails(userData);
  const clearUserAndProjectsData = () => {
    setuserDetails(undefined);
    setprojectsData([]);
  };

  return (
    <>
      <UserDataContext.Provider value={{ userData, projectsData, clearUserAndProjectsData }}>{children}</UserDataContext.Provider>
    </>
  );
};

function useUserDataValue() {
  return useContext(UserDataContext);
}

export { UserDetailsProvider, useUserDataValue };
