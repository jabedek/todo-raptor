import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { LackingValidations } from "@@types";
import { LoadingSpinner } from "@@components/common";
import { usePopupContext } from "@@components/Layout";
import { AppCodeForm } from "@@components/Account";
import { useApiAccessValue, useUserValue } from "@@contexts";

type Props = { children: React.ReactNode; path: string; logPath?: string };

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { firebaseAuthUser, user } = useUserValue();
  const { shouldPingUser, hasProvided, canAccessAPI, checkProvidedCode } = useApiAccessValue();
  const [canRoute, setcanRoute] = useState<"checking" | boolean>("checking");
  const navigate = useNavigate();
  const { showPopup } = usePopupContext();
  const fallbackPath = "/login";
  const [authTries, setauthTries] = useState(0);

  const popupCodeForm = (hasProvided: LackingValidations): void =>
    showPopup(
      <AppCodeForm
        user={user}
        checkCode={(email: string, code: string): Promise<LackingValidations> => checkProvidedCode(email, code)}
        neededToVerify={{ mustProvideCode: !hasProvided.validAppCode, mustVerifyEmail: !hasProvided.verifiedEmail }}
      />
    );

  const getInfo = (): {
    authTries: number;
    isValid: boolean;
  } => ({
    authTries,
    isValid: !!(user || firebaseAuthUser) && !!canAccessAPI,
  });

  const check = (): void => {
    const data = getInfo();
    if (!data.isValid) {
      setauthTries(data.authTries + 1);
    } else {
      setcanRoute(true);
      setauthTries(0);
    }
  };

  useEffect(() => {
    let timer1: NodeJS.Timeout | undefined;
    let timer2: NodeJS.Timeout | undefined;
    const data = getInfo();
    if (data.isValid) {
      setcanRoute(true);
      setauthTries(0);
    } else {
      if (data.authTries < 4) {
        timer1 = setTimeout(() => check(), 250);
      }

      if (data.authTries >= 4 && data.authTries <= 6) {
        timer2 = setTimeout(() => check(), 500);
      }

      if (data.authTries > 6) {
        setcanRoute(false);
        setauthTries(0);
        navigate(fallbackPath);
      }
    }
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [firebaseAuthUser, user, canAccessAPI, authTries]);

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
