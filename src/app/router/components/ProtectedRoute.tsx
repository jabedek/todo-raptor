import { Navigate } from "react-router-dom";
import { useUserValue } from "src/app/contexts";
import { useEffect, useState } from "react";

const ProtectedRoute: React.FC<{ children: React.ReactNode; logPath?: string }> = ({ children, logPath }) => {
  const { user } = useUserValue();
  const [canRoute, setcanRoute] = useState<"checking" | boolean>("checking");

  useEffect(() => {
    const timer = setTimeout(() => setcanRoute(!!user), 1000 * 10);

    if (user) {
      setcanRoute(true);
      clearTimeout(timer);
    }

    return () => clearTimeout(timer);
  }, [user]);

  useEffect(() => {
    if (logPath) {
      console.log("[ProtectedRoute]:", logPath);
    }
  }, [logPath]);

  return (
    <>
      {(canRoute || user) && <>{children}</>}
      {canRoute === false && (
        <Navigate
          to="/"
          replace
        />
      )}

      {canRoute === "checking" && <p>{"Loading"}</p>}
    </>
  );
};

export default ProtectedRoute;
