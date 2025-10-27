import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { getOrganizer } from "../../Redux/organizerSlice";

const OrganizerProtected = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { organizer, isLoading } = useSelector((store) => store.organizer);
  const { user } = useSelector((store) => store.user);

  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (user?._id) {
      dispatch(getOrganizer({ userId: user._id })).finally(() =>
        setFetched(true)
      );
    } else {
      setFetched(true);
    }
  }, [dispatch, user?._id]);

  if (isLoading || !fetched) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-12 h-12 animate-spin text-violet-600" />
      </div>
    );
  }


  if (!organizer) {
    return location.pathname === "/listmyShow/register" ? (
      <Outlet />
    ) : (
      <Navigate to="/listmyShow/register" replace />
    );
  }

  if (organizer.status === 'pending') {
    return location.pathname === "/listmyShow/requested" ? (
      <Outlet />
    ) : (
      <Navigate to="/listmyShow/requested" replace />
    );
  }

  if (organizer.status === 'rejected') {
    return location.pathname === "/listmyShow/rejected" ? (
      <Outlet />
    ) : (
      <Navigate to="/listmyShow/rejected" replace />
    );
  }

  return location.pathname === "/listmyShow/dashboard" ? (
    <Outlet />
  ) : (
    <Navigate to="/listmyShow/dashboard" replace />
  );
};

export default OrganizerProtected;
