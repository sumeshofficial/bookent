import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { getOrganizer } from "../../redux/organizerSlice";
import OrganizerAccountForm from "../../pages/organizer/OrganizerAccountForm";
import OrganizerAccRequested from "../../pages/organizer/OrganizerAccRequested";
import OrganizerAccRejected from "../../pages/organizer/OrganizerAccRejected";

const OrganizerProtected = () => {
  const dispatch = useDispatch();

  const { organizer, isLoading } = useSelector((state) => state.organizer);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getOrganizer({ userId: user._id }));
  }, []);

  if (!organizer) {
    return <OrganizerAccountForm />;
  }

  const status = organizer.status;
  if (status === "pending") {
    return <OrganizerAccRequested />;
  }

  if (status === "rejected") {
    return <OrganizerAccRejected />;
  }

  return <Outlet />;
};

export default OrganizerProtected;
