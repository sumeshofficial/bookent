import { Navigate } from "react-router-dom";

const ProtectedSessionTimeout = ({ children }) => {
  const expired = localStorage.getItem("sessionExpired");

  if (!expired) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedSessionTimeout;
