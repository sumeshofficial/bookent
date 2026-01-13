import { useMemo, useState } from "react";

const useEventStatusUpdate = (currentStatus, oldMatchDateFromEvent) => {
  const [status, setStatus] = useState("");

  const [postponeDetails, setPostponeDetails] = useState({
    oldMatchDate: oldMatchDateFromEvent || "",
    newMatchDate: "",
    reason: "",
  });

  const [cancelDetails, setCancelDetails] = useState({
    reason: "",
  });

  const updatePostpone = (key, value) => {
    if (key === "oldMatchDate") return;
    setPostponeDetails((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateCancel = (reason) => {
    setCancelDetails({ reason });
  };

  const isStatusAllowed = useMemo(() => {
    if (!status) return false;

    if (currentStatus === "Draft" && status === "Published") return true;

    if (
      (currentStatus === "Published" || currentStatus === "Postpone") &&
      (status === "Postpone" || status === "Cancelled")
    ) {
      return true;
    }

    return false;
  }, [currentStatus, status]);

  const postponeError = useMemo(() => {
    if (status !== "Postpone") return "";

    const { oldMatchDate, newMatchDate, reason } = postponeDetails;

    if (!oldMatchDate || !newMatchDate || !reason) {
      return "All postpone fields are required";
    }
    if (new Date(newMatchDate) < new Date(oldMatchDate)) {
      return "New match date must be same or after old match date";
    }

    return "";
  }, [status, postponeDetails]);

  const isPostponeValid = !postponeError;

  const cancelError = useMemo(() => {
    if (status !== "Cancelled") return "";

    if (!cancelDetails.reason) {
      return "Cancellation reason is required";
    }

    return "";
  }, [status, cancelDetails]);

  const isCancelValid = !cancelError;

  const isFormValid = isStatusAllowed && isPostponeValid && isCancelValid;

  const error = postponeError || cancelError || "";

  const buildPayload = () => {
    if (!isFormValid) return null;

    const payload = { eventStatus: status };

    if (status === "Postpone") {
      payload.matchDate = postponeDetails.newMatchDate;

      payload.postponeDetails = {
        isPostponed: true,
        oldMatchDate: postponeDetails.oldMatchDate,
        newMatchDate: postponeDetails.newMatchDate,
        reason: postponeDetails.reason,
      };
    }

    if (status === "Cancelled") {
      payload.cancelDetails = {
        isCancelled: true,
        reason: cancelDetails.reason,
      };
    }

    return payload;
  };

  return {
    status,
    setStatus,
    postponeDetails,
    cancelDetails,
    updatePostpone,
    updateCancel,
    buildPayload,
    isFormValid,
    error,
  };
};

export default useEventStatusUpdate;
