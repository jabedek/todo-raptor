import { Navigate, useNavigate } from "react-router-dom";
import { useUserValue } from "src/app/contexts";
import { useContext, useEffect, useState } from "react";
import { LoadingSpinner } from "@@components/common";
import { usePopupContext } from "@@components/Layout";
import { UserContext } from "src/app/contexts/UserContext";

const ProtectedRoute: React.FC<{ children: React.ReactNode; path: string; logPath?: string }> = ({ children, path, logPath }) => {
  const { user, canUseAPI } = useContext(UserContext);
  const [canRoute, setcanRoute] = useState<"checking" | boolean>("checking");
  const navigate = useNavigate();
  const { hidePopup } = usePopupContext();
  const fallbackPath = "/login";

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    const isValid = !!(user && canUseAPI);
    console.log(user, canUseAPI);

    if (!isValid) {
      timer = setTimeout(() => {
        const canRoute = !!(user && canUseAPI);
        console.log("canRoute", canRoute);

        setcanRoute(canRoute);

        if (!canRoute) {
          console.log("navigate to", fallbackPath);
          hidePopup();
          navigate(fallbackPath);
        }
      }, 1000 * 3);
    }

    if (isValid) {
      setcanRoute(true);
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [user, canUseAPI]);

  useEffect(() => {
    if (logPath) {
      console.log("[ProtectedRoute]:", logPath);
    }
  }, [logPath]);

  return (
    <>
      {canRoute === true && <>{children}</>}
      {canRoute === false && (
        <Navigate
          to={fallbackPath}
          replace
        />
      )}

      {canRoute === "checking" && (
        <>
          <p className="w-full text-center my-5 text-[18px] font-bold font-app_primary  text-app_tertiary drop-shadow-[app_text_sharp] ">
            Checking user...
          </p>
          <LoadingSpinner size="xl" />
        </>
      )}
    </>
  );
};

export default ProtectedRoute;
