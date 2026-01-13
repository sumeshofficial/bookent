import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { VERIFY_STATUS } from "../constants/verify.constants";

const VerifyResult = ({ status, message, ticketData, onReset }) => {
  if (status === VERIFY_STATUS.LOADING) {
    return (
      <div className="flex flex-col items-center gap-3 py-10">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    );
  }

  if (status === VERIFY_STATUS.SUCCESS) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <CheckCircle className="h-12 w-12 text-green-600" />
        <p className="text-sm font-medium text-green-700">{message}</p>

        <div className="w-full rounded-lg border bg-gray-50 p-4 text-left text-sm space-y-1">
          <p>
            <b>Event:</b> {ticketData?.eventTitle}
          </p>
          <p>
            <b>Name:</b> {ticketData?.userName}
          </p>
          <p>
            <b>Seats:</b> {ticketData?.seatInfo}
          </p>
        </div>

        <button
          onClick={onReset}
          className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm"
        >
          Scan Next Ticket
        </button>
      </div>
    );
  }

  if (status === VERIFY_STATUS.ERROR) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <XCircle className="h-12 w-12 text-red-600" />
        <p className="text-sm font-medium text-red-600">{message}</p>
        <button
          onClick={onReset}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  return null;
};

export default VerifyResult;
