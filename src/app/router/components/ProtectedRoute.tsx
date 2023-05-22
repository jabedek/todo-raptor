import { Navigate, useNavigate } from "react-router-dom";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { LoadingSpinner } from "@@components/common";
import { usePopupContext } from "@@components/Layout";
import { UserContext, useUserValue } from "src/app/contexts/UserContext";
import { AppCodeForm } from "@@components/Account";

type Props = { children: React.ReactNode; path: string; logPath?: string };

const ProtectedRoute: React.FC<Props> = ({ children, path, logPath }) => {
  const { firebaseAuthUser, user, canUseAPI, checkAccessToAPI, codeNeeded, emailNeeded } = useUserValue();
  const [canRoute, setcanRoute] = useState<"checking" | boolean>("checking");
  const navigate = useNavigate();
  const { showPopup, hidePopup } = usePopupContext();
  const fallbackPath = "/login";

  const popupCodeForm = (codeNeeded: boolean, emailNeeded: boolean) =>
    showPopup(
      <AppCodeForm
        submitFn={checkAccessToAPI}
        user={user}
        emailVerified={!!firebaseAuthUser?.emailVerified}
        neededToVerify={{ codeNeeded, emailNeeded }}
      />,
      true
    );

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
    if (!!(codeNeeded || emailNeeded)) {
      console.log(codeNeeded, emailNeeded);

      popupCodeForm(!!codeNeeded, !!emailNeeded);
    }
  }, [codeNeeded, emailNeeded]);

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
