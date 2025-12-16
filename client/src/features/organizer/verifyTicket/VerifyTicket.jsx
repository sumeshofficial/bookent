import { useState } from "react";
import VerifyHeader from "./components/VerifyHeader";
import QRReader from "./components/QRReader";
import VerifyResult from "./components/VerifyResult";
import { VERIFY_STATUS } from "./constants/verify.constants";
import { useVerifyTicket } from "./hooks/useVerifyTicket";
import { useTicketScanner } from "./hooks/useTicketScanner";
import toast from "react-hot-toast";

const VerifyTicket = () => {
  const [status, setStatus] = useState(VERIFY_STATUS.IDLE);
  const [message, setMessage] = useState("");
  const [ticketData, setTicketData] = useState(null);

  const { mutate: verifyTicket } = useVerifyTicket();

  const { scanAgain } = useTicketScanner({
    verifyTicket,
    onLoading: () => {
      setStatus(VERIFY_STATUS.LOADING);
      setMessage("Verifying ticket...");
    },
    onSuccess: (data) => {
      toast.dismiss();
      toast.success("Ticket verified successfully");
      setTicketData(data);
      setStatus(VERIFY_STATUS.SUCCESS);
      setMessage("Ticket verified successfully");
    },
    onError: (msg) => {
      toast.dismiss();
      toast.error(msg);
      setStatus(VERIFY_STATUS.ERROR);
      setMessage(msg);
    },
  });

  const resetScanner = () => {
    setStatus(VERIFY_STATUS.IDLE);
    setMessage("");
    setTicketData(null);
    scanAgain();
  };

  return (
    <div className="flex items-center justify-center px-4 h-full">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg border">
        <VerifyHeader />

        <div className="p-6 space-y-6">
          {status === VERIFY_STATUS.IDLE && <QRReader />}

          <VerifyResult
            status={status}
            message={message}
            ticketData={ticketData}
            onReset={resetScanner}
          />
        </div>

        <div className="px-6 py-4 border-t text-xs text-gray-400 text-center">
          Organizer ticket validation • Bookent
        </div>
      </div>
    </div>
  );
};

export default VerifyTicket;
