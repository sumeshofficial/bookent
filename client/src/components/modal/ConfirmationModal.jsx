import { useEffect } from "react";
import { useState } from "react";
import { X, AlertTriangle, HelpCircle, ChevronDown } from "lucide-react";

const ConfirmationModal = ({
  title = "Update Status Confirmation",
  message = "Are you sure you want to continue",
  handleAction,
  closeModal,
  status,
  id,
}) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeModal]);

  const [openReason, setOpenReason] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");

  const handleOnClick = () => {
    handleAction(id, status, selectedReason);
    closeModal();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 animate-fadeIn">
      <div className="bg-white w-[90%] max-w-md rounded-xl shadow-lg p-6 animate-scaleIn relative">
        <button
          onClick={closeModal}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="flex justify-center mb-3">
          <HelpCircle className="text-yellow-600" size={42} />
        </div>

        <h2 className="text-xl font-bold text-center text-gray-900 mb-2">
          {title}
        </h2>

        <p className="text-center text-gray-600 mb-6 leading-relaxed">
          {message}
        </p>

        {status === "rejected" && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Reason
            </label>
            <div className="relative w-full">
              <div
                className="w-full border rounded-lg p-2.5 bg-white text-gray-700 cursor-pointer flex justify-between items-center"
                onClick={() => setOpenReason(!openReason)}
              >
                {selectedReason || "Choose a reason"}
                <ChevronDown className="text-gray-500"/>
              </div>

              {openReason && (
                <div className="absolute mt-1 w-full border bg-white rounded-lg shadow-lg z-20 max-h-64 overflow-y-scroll">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500">General Verification Issues</div>
                  {[
                    "Incomplete Information",
                    "Invalid Details",
                    "Verification Failed",
                    "Document Verification Failed"
                  ].map((item) => (
                    <div
                      key={item}
                      className="p-2.5 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedReason(item);
                        setOpenReason(false);
                      }}
                    >
                      {item}
                    </div>
                  ))}

                  <div className="px-3 py-2 text-xs font-semibold text-gray-500">Bank / Financial Issues</div>
                  {[
                    "Invalid Bank Details",
                    "Bank Account Verification Failed",
                    "IFSC Code Mismatch"
                  ].map((item) => (
                    <div
                      key={item}
                      className="p-2.5 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedReason(item);
                        setOpenReason(false);
                      }}
                    >
                      {item}
                    </div>
                  ))}

                  <div className="px-3 py-2 text-xs font-semibold text-gray-500">Compliance Issues</div>
                  {[
                    "Organisation Not Eligible",
                    "Unsupported Business Category",
                    "Unable To Verify Organisation Legitimacy"
                  ].map((item) => (
                    <div
                      key={item}
                      className="p-2.5 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedReason(item);
                        setOpenReason(false);
                      }}
                    >
                      {item}
                    </div>
                  ))}

                  <div className="px-3 py-2 text-xs font-semibold text-gray-500">Communication Issues</div>
                  {[
                    "Unable To Reach Organisation",
                    "No Response To Verification Steps"
                  ].map((item) => (
                    <div
                      key={item}
                      className="p-2.5 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedReason(item);
                        setOpenReason(false);
                      }}
                    >
                      {item}
                    </div>
                  ))}

                  <div className="px-3 py-2 text-xs font-semibold text-gray-500">Other Issues</div>
                  {[
                    "Suspicious or Incorrect Submission",
                    "Duplicate Account Request",
                    "Other"
                  ].map((item) => (
                    <div
                      key={item}
                      className="p-2.5 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedReason(item);
                        setOpenReason(false);
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={closeModal}
            className="flex-1 py-2.5 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition"
          >
            Cancel
          </button>

          <button
              onClick={handleOnClick}
              disabled={status === "rejected" && !selectedReason}
              className={`flex-1 py-2.5 rounded-lg font-medium transition 
                ${status === "rejected" && !selectedReason 
                  ? "bg-violet-400 text-white cursor-not-allowed" 
                  : "bg-violet-600 text-white hover:bg-violet-700"
                }`}
          >
              Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
