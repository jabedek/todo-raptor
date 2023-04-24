import { User, UserData } from "@@types/User";
import { createContext, useState } from "react";
import { useEffect, useContext } from "react";
import { Unsubscribe } from "firebase/auth";
import { UsersAPI } from "@@services/api/usersAPI";
import { useNavigate } from "react-router-dom";
import { ListenersAPI } from "@@services/api/listenersAPI";
import { useAuthValue } from "./AuthDataContext";
import { Project } from "@@types/Project";

type UserDataContext = {
  userData: UserData | undefined;
  projectsData: Project[];
  clearUserAndProjectsData: () => void;
};

const UserDataContext = createContext<UserDataContext>({
  userData: undefined,
  projectsData: [],
  clearUserAndProjectsData: () => {},
});

const Unsubscribes = new Map<string, Unsubscribe>();

const UserDetailsProvider = ({ children }: any) => {
  const [userData, setuserDetails] = useState<UserData | undefined>(undefined);
  const [projectsData, setprojectsData] = useState<Project[]>([]);
  const { auth } = useAuthValue();

  const navigate = useNavigate();

  useEffect(() => {
    if (auth) {
      UsersAPI.getUserDetailsById(auth.id).then((user: User | undefined) => {
        if (user) {
          const details: UserData = {
            workDetails: user.userData.workDetails,
            verificationDetails: user.userData.verificationDetails,
            visuals: user.userData?.visuals || { colorPrimary: "", colorSecondary: "", colorTertiary: "" },
          };

          setTimeout(() => navigate("/account", { relative: "route" }), 500);
          putUserDetails(details);

          ListenersAPI.listenToAuthUserData(auth.id, (data: User, unsub1) => {
            Unsubscribes.set("listenToAuthUserData", unsub1);
            if (data) {
              putUserDetails(data.userData);
            }
          });

          ListenersAPI.listenToAuthProjectsData(auth.id, [], (data: Project[], unsub1) => {
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

  const putUserDetails = (userData: UserData) => setuserDetails(userData);
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

export { UserDataContext, UserDetailsProvider, useUserDataValue };
