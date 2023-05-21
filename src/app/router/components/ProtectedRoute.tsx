import { Navigate, useNavigate } from "react-router-dom";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { LoadingSpinner } from "@@components/common";
import { usePopupContext } from "@@components/Layout";
import { UserContext } from "src/app/contexts/UserContext";

type Props = { children: React.ReactNode; path: string; logPath?: string };

const ProtectedRoute: React.FC<Props> = ({ children, path, logPath }) => {
  const { firebaseAuthUser, user, canUseAPI } = useContext(UserContext);
  const [canRoute, setcanRoute] = useState<"checking" | boolean>("checking");
  const navigate = useNavigate();
  const { hidePopup } = usePopupContext();
  const fallbackPath = "/login";

  useLayoutEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    const anyUser = !!(user || firebaseAuthUser);
    const isValid = !!(anyUser && canUseAPI);
    console.log(user, canUseAPI);

    if (!isValid) {
      timer = setTimeout(() => {
        const anyUser = !!(user || firebaseAuthUser);
        const canRoute = !!(anyUser && canUseAPI);
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
  }, [firebaseAuthUser, user, canUseAPI]);

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
          <p className="w-full text-center my-5 text-[18px] font-bold font-app_primary  text-app_secondary drop-shadow-[app_text_sharp] ">
            Checking user...
          </p>
          <LoadingSpinner
            size="xl"
            colors="border-app_secondary border-t-app_quarternary"
          />
        </>
      )}
    </>
  );
};

export default ProtectedRoute;
