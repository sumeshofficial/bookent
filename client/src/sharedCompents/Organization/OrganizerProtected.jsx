import { useSelector, useDispatch } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { getOrganizer } from "../../Redux/organizerSlice";

const OrganizerProtected = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { organizer, isLoading } = useSelector((store) => store.organizer);
  const { user } = useSelector((store) => store.auth);

  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (user?._id) {
      dispatch(getOrganizer({ userId: user._id })).finally(() =>
        setFetched(true)
      );
    } else {
      setFetched(true); // no user, still allow rendering
    }
  }, [dispatch, user?._id]);

  if (isLoading || !fetched) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-12 h-12 animate-spin text-violet-600" />
      </div>
    );
  }

  // Case 1: No organizer data
  if (!organizer) {
    return location.pathname === "/listmyShow/register" ? (
      <Outlet />
    ) : (
      <Navigate to="/listmyShow/register" replace />
    );
  }

  // Case 2: Organizer exists but not verified
  if (!organizer.isVerified) {
    return location.pathname === "/listmyShow/requested" ? (
      <Outlet />
    ) : (
      <Navigate to="/listmyShow/requested" replace />
    );
  }

  // Case 3: Verified organizer
  return location.pathname === "/listmyShow/dashboard" ? (
    <Outlet />
  ) : (
    <Navigate to="/listmyShow/dashboard" replace />
  );
};

export default OrganizerProtected;
