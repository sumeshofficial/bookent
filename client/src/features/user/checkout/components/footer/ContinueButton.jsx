import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { verifySeatLock } from "../../../../../services/user.js";

const ContinueButton = ({ eventSlug, isLoading }) => {
  const navigate = useNavigate();

  const handleContinue = async () => {
    const lockId = sessionStorage.getItem("lockId");

    if (!lockId) {
      toast.dismiss();
      toast.error("Your seat lock session expired. Please select seats again.");
      return;
    }

    try {
      const response = await verifySeatLock(lockId);
      const isStillValid = response?.isValid;

      if (!isStillValid) {
        toast.dismiss();
        toast.error("Seat lock expired! Please reselect your seats.");
        sessionStorage.removeItem("lockId");
        sessionStorage.removeItem("appliedCoupon");
        return;
      }

      navigate(`/event/${eventSlug}/payment-method`);
    } catch (error) {
      toast.dismiss();
      toast.error(
        error?.response?.data?.error.message ||
          error.message ||
          "Something went wrong"
      );
      sessionStorage.removeItem("lockId");
      sessionStorage.removeItem("appliedCoupon");
      return navigate("/session-expired", { replace: true });
    }
  };

  return (
    <button
      disabled={isLoading}
      onClick={handleContinue}
      className="w-full bg-black text-white py-3 rounded-lg text-base font-semibold disabled:bg-gray-500 disabled:cursor-not-allowed"
    >
      CONTINUE
    </button>
  );
};

export default ContinueButton;
