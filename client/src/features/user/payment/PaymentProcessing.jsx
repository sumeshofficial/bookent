import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import useBackBlocker from "./hooks/useBackBlocker";
import usePaymentStatus from "./hooks/usePaymentStatus";
import toast from "react-hot-toast";

const PaymentProcessing = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get("orderId");
  const eventSlug = searchParams.get("eventSlug");

  const { status, message } = usePaymentStatus(orderId, {
    onSuccess: () => {
      setTimeout(
        () => navigate(`/ticket?orderId=${orderId}`, { replace: true }),
        1200
      );
    },
    onFail: () => {
      toast.dismiss();
      toast.error("Something went wrong");
    },
  });

  useBackBlocker();

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-50">
      {status === "pending" && (
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-500 border-t-transparent"></div>
      )}
      {status === "success" && (
        <CheckCircle className="text-green-500 w-24 h-24 animate-bounce" />
      )}
      {status === "failed" && (
        <XCircle className="text-red-500 w-24 h-24 animate-pulse" />
      )}

      <h1 className="text-2xl font-semibold mt-6">
        {status === "pending" && "Processing Payment"}
        {status === "success" && "Payment Verified"}
        {status === "failed" && "Payment Failed"}
      </h1>

      <p className="text-gray-600 mt-2">{message}</p>

      {status === "failed" && (
        <button
          className="mt-6 px-6 py-3 bg-red-500 text-white rounded-xl"
          onClick={() =>
            navigate(`/event/${eventSlug}/payment-method`, { replace: true })
          }
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default PaymentProcessing;
