import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { getOrganizer } from "../../app/organizerSlice";
import OrganizerAccountForm from "../../features/organizer/OrganizerAccountForm";
import OrganizerAccRequested from "../../features/organizer/OrganizerAccRequested";

const OrganizerProtected = () => {
  const dispatch = useDispatch();

  const { organizer } = useSelector((state) => state.organizer);
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
    return <OrganizerAccountForm isRejected={true} />;
  }

  return <Outlet />;
};

export default OrganizerProtected;
