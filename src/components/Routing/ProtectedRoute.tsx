import { useAuthValue } from "@@context/AuthDataContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { auth } = useAuthValue();

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
