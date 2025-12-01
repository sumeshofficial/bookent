import { useNavigate } from "react-router-dom";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";

const MobileBookingBar = ({
  selectedShape,
  ticketSetup = [],
  shapes = [],
  eventId,
  lockSection
}) => {
  const navigate = useNavigate();
  const index = selectedShape
    ? shapes.findIndex((s) => s.id === selectedShape.id)
    : -1;

  const info = index >= 0 ? ticketSetup?.[index] : null;

  const [quantity, setQuantity] = useState(1);

  const maxQty = Math.min(info?.perUserLimit || 1, info?.availableTickets || 0);

  useEffect(() => {
    if (!info) return;

    if (quantity > maxQty) {
      setQuantity(maxQty || 1);
    }

    if (quantity < 1) {
      setQuantity(1);
    }
  }, [selectedShape, info, maxQty]);

  const handleBookNow = async () => {
    lockSection(info.sectionId, quantity, (lockId) => {
      if (!lockId) return;

      localStorage.setItem("activeLockId", lockId);
      localStorage.setItem("selectedSection", info.sectionId);
      localStorage.setItem("selectedQuantity", quantity);

      navigate(`/event/${eventId}/checkout`);
    });
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-xl border-t p-4 z-50">
      {selectedShape ? (
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="font-bold text-base">{selectedShape.title}</span>
            <span className="text-sm text-gray-600">
              Available: {info?.availableTickets ?? 0} /{" "}
              {info?.totalTickets ?? 0}
            </span>
            <span className="font-semibold text-gray-800">
              ₹{info?.seatPrice ?? "—"}
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
            className="py-3 px-6 bg-red-500 text-white rounded-lg text-lg font-semibold whitespace-nowrap"
          >
            Book Now
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
