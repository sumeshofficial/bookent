import { Navigate, useLocation } from "react-router-dom";

const NormalizeSlash = () => {
  const location = useLocation();
  if (location.pathname.endsWith("/") && location.pathname !== "/") {
    return <Navigate to={location.pathname.slice(0, -1)} replace />;
  }
  return null;
};

export default NormalizeSlash;