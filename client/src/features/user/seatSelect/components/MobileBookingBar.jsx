import { useNavigate } from "react-router-dom";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";

const MobileBookingBar = ({
  selectedShape,
  ticketSetup = [],
  eventSlug,
  lockSection,
  lockedSections,
}) => {
  const navigate = useNavigate();

  const info = selectedShape
    ? ticketSetup.find((t) => t.sectionId === selectedShape.id)
    : null;

  let adjustedInfo = info;

  if (info && lockedSections && lockedSections[selectedShape.id]) {
    const lockedData = lockedSections[selectedShape.id];
    if (!lockedData.lockedBy || lockedData.status === "available") {
      adjustedInfo = {
        ...info,
        availableTickets: info.availableTickets,
      };
    } else {
      adjustedInfo = {
        ...info,
        availableTickets: info.availableTickets - (lockedData.qty || 0),
      };
    }
  }

  const [quantity, setQuantity] = useState(1);

  const maxQty = Math.min(
    adjustedInfo?.perUserLimit || 1,
    adjustedInfo?.availableTickets || 0
  );

  useEffect(() => {
    if (!adjustedInfo) return;

    if (quantity > maxQty) {
      setQuantity(maxQty || 1);
    }

    if (quantity < 1) {
      setQuantity(1);
    }
  }, [selectedShape, adjustedInfo, maxQty]);

  const handleBookNow = async () => {
    lockSection(adjustedInfo.sectionId, quantity, (lockId) => {
      if (!lockId) return;

      console.log(lockId);

      sessionStorage.setItem("lockId", lockId);

      navigate(`/event/${eventSlug}/checkout`);
    });
  };

  // Disable booking when no tickets available
  const isSoldOut = (adjustedInfo?.availableTickets || 0) === 0 || (maxQty || 0) === 0;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-xl border-t p-4 z-50">
      {selectedShape ? (
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="font-bold text-base">{selectedShape.title}</span>
            <span className="text-sm text-gray-600">
              Available: {adjustedInfo?.availableTickets ?? 0} /{" "}
              {adjustedInfo?.totalTickets ?? 0}
            </span>
            <span className="font-semibold text-gray-800">
              ₹{adjustedInfo?.seatPrice ?? "—"}
            </span>

            {/* Quantity Selector */}
            {/* Quantity Selector */}
            <div className="mt-2 flex items-center gap-3">
              <button
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                className="p-2 border rounded-md"
              >
                <Minus size={18} />
              </button>

              <span className="font-semibold min-w-[24px] text-center">
                {quantity}
              </span>

              <button
                onClick={() => quantity < maxQty && setQuantity(quantity + 1)}
                className="p-2 border rounded-md"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <button
            onClick={handleBookNow}
            disabled={isSoldOut}
            className={
              `py-3 px-6 rounded-lg text-lg font-semibold whitespace-nowrap ` +
              (isSoldOut
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-red-500 text-white")
            }
          >
            {isSoldOut ? "Sold Out" : "Book Now"}
          </button>
        </div>
      ) : (
        <button
          disabled
          className="w-full py-3 bg-gray-300 text-gray-600 rounded-lg text-lg font-semibold"
        >
          Select a Section
        </button>
      )}
    </div>
  );
};

export default MobileBookingBar;
