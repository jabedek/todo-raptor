import { Navigate } from "react-router-dom";
import { useUserValue } from "src/app/contexts";
import { useEffect, useState } from "react";

const ProtectedRoute: React.FC<{ children: React.ReactNode; logPath?: string }> = ({ children, logPath }) => {
  const { user, canUseAPI } = useUserValue();
  const [canRoute, setcanRoute] = useState<"checking" | boolean>("checking");

  useEffect(() => {
    const isValid = !!user && canUseAPI;

    const timer = setTimeout(() => setcanRoute(!!isValid), 1000 * 10);

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
      {(canRoute === true || (!!user && canUseAPI)) && <>{children}</>}
      {canRoute === false && (
        <Navigate
          to="/"
          replace
        />
      )}

      {canRoute === "checking" && <p className="text-red-500">{"Loading"}</p>}
    </>
  );
};

export default ProtectedRoute;
