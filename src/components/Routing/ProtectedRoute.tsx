import { useAuthDataValue } from "@@context/AuthDataContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { auth } = useAuthDataValue();

  if (!auth) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
