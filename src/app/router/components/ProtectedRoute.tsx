import { Navigate, useNavigate } from "react-router-dom";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { LoadingSpinner } from "@@components/common";
import { usePopupContext } from "@@components/Layout";
import { UserContext, useUserValue } from "src/app/contexts/UserContext";
import { AppCodeForm } from "@@components/Account";
import { LackingValidations, useApiAccessValue } from "src/app/contexts/ApiAccessContext";

type Props = { children: React.ReactNode; path: string; logPath?: string };

const ProtectedRoute: React.FC<Props> = ({ children, path, logPath }) => {
  const { firebaseAuthUser, user } = useUserValue();
  const { shouldPingUser, hasProvided, canAccessAPI, checkProvidedCode } = useApiAccessValue();
  const [canRoute, setcanRoute] = useState<"checking" | boolean>("checking");
  const navigate = useNavigate();
  const { showPopup, hidePopup } = usePopupContext();
  const fallbackPath = "/login";

  const popupCodeForm = (hasProvided: LackingValidations) =>
    user &&
    showPopup(
      <AppCodeForm
        user={user}
        checkCode={(email: string, code: string) => checkProvidedCode(email, code)}
        neededToVerify={{ mustProvideCode: !hasProvided.validAppCode, mustVerifyEmail: !hasProvided.verifiedEmail }}
      />
    );

  useLayoutEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    const isValid = !!(user || firebaseAuthUser) && !!canAccessAPI;

    if (!isValid) {
      timer = setTimeout(() => {
        setcanRoute(!!(user || firebaseAuthUser) && !!canAccessAPI);
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
  }, [firebaseAuthUser, user, canAccessAPI]);

  useEffect(() => {
    if (shouldPingUser) {
      popupCodeForm(hasProvided);
    }
  }, [shouldPingUser]);

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
