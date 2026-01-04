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

  // Update helpers
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

  // Status transition rules
  const isStatusAllowed = useMemo(() => {
    if (!status) return false;

    if (currentStatus === "Draft" && status === "Published") return true;

    // Allow same status (no-op edit)
    if (currentStatus === status) return true;

    // Published → Postpone / Cancelled
    if (
      (currentStatus === "Published" || currentStatus === "Postpone") &&
      (status === "Postpone" || status === "Cancelled")
    ) {
      return true;
    }

    return false;
  }, [currentStatus, status]);

  // Postpone validation
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

  // Cancel validation
  const cancelError = useMemo(() => {
    if (status !== "Cancelled") return "";

    if (!cancelDetails.reason) {
      return "Cancellation reason is required";
    }

    return "";
  }, [status, cancelDetails]);

  const isCancelValid = !cancelError;

  const isFormValid = isStatusAllowed && isPostponeValid && isCancelValid;

  // Compute error message
  const error = postponeError || cancelError || "";

  // Build payload for API
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
