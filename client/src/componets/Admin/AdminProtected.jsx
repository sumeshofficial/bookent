import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { getAdmin } from "../../Redux/adminSlice";

const AdminProtected = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { admin, isLoading } = useSelector((state) => state.admin);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const fetchAdmin = () => {
      dispatch(getAdmin());
      setAuthChecked(true);
    };
    fetchAdmin();
  }, [dispatch]);

  if (
    location.pathname.endsWith("/") &&
    location.pathname !== "/" &&
    !isLoading
  ) {
    return <Navigate to={location.pathname.slice(0, -1)} replace />;
  }

  if (!authChecked || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-12 h-12 animate-spin text-violet-600" />
      </div>
    );
  }

  if (!admin && location.pathname !== "/admin/login") {
    return <Navigate to="/admin/login" replace />;
  }

  if (admin && location.pathname === "/admin/login") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminProtected;
