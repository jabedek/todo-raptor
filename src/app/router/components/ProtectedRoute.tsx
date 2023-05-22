import { Navigate, useNavigate } from "react-router-dom";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { LoadingSpinner } from "@@components/common";
import { usePopupContext } from "@@components/Layout";
import { UserContext, useUserValue } from "src/app/contexts/UserContext";

type Props = { children: React.ReactNode; path: string; logPath?: string };

const ProtectedRoute: React.FC<Props> = ({ children, path, logPath }) => {
  const { firebaseAuthUser, user, canUseAPI, checkAccessToAPI } = useUserValue();
  const [canRoute, setcanRoute] = useState<"checking" | boolean>("checking");
  const navigate = useNavigate();
  const { hidePopup } = usePopupContext();
  const fallbackPath = "/login";

  useLayoutEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    const isValid = !!(user || firebaseAuthUser);

    if (!isValid) {
      timer = setTimeout(() => {
        setcanRoute(!!(user || firebaseAuthUser));
        if (!canRoute) {
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
    if (canUseAPI !== undefined) {
      if (!canUseAPI) {
        checkAccessToAPI("")
          .then((res) => {
            if (!!res) {
              setcanRoute(true);
            }
          })
          .catch(() => {
            setcanRoute(false);
          });
      }
    }
  }, [canUseAPI]);

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
