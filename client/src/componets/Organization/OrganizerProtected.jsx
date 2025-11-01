import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader } from "lucide-react";
import { getOrganizer } from "../../Redux/organizerSlice";

const OrganizerProtected = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const { organizer, isLoading } = useSelector((state) => state.organizer);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user?._id) {
      dispatch(getOrganizer({ userId: user._id }));
    }
  }, [dispatch, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-12 h-12 animate-spin text-violet-600" />
      </div>
    );
  }

  if (!organizer) {
    if (location.pathname.includes("/register")) {
      return <Outlet />;
    }
    return <Navigate to="/listmyshow/register" replace />;
  }

  const status = organizer.status;
  const path = location.pathname;

  if (status === "pending") {
    if (!path.includes("/requested")) {
      return <Navigate to="/listmyshow/requested" replace />;
    }
    return <Outlet />;
  }

  if (status === "rejected") {
    if (!path.includes("/rejected")) {
      return <Navigate to="/listmyshow/rejected" replace />;
    }
    return <Outlet />;
  }

  if (status === "approved") {
    if (
      path.includes("/register") ||
      path.includes("/requested") ||
      path.includes("/rejected")
    ) {
      return <Navigate to="/listmyshow/dashboard" replace />;
    }
    return <Outlet />;
  }

  return <Outlet />;
};

export default OrganizerProtected;
