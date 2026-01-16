import { useNavigate } from "react-router-dom";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";
import PropTypes from "prop-types";

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

  const handleBookNow = async () => {
    lockSection(adjustedInfo.sectionId, quantity, (lockId) => {
      if (!lockId) return;

      sessionStorage.setItem("lockId", lockId);

      navigate(`/event/${eventSlug}/checkout`);
    });
  };

  const isSoldOut =
    (adjustedInfo?.availableTickets || 0) === 0 || (maxQty || 0) === 0;

  return (
    <div
      key={selectedShape?.id}
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-xl border-t p-4 z-50"
    >
      {selectedShape ? (
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="font-bold text-base">{selectedShape.title}</span>
            <span className="text-sm text-gray-600">
              Available: {adjustedInfo?.availableTickets ?? 0} /{" "}
              {adjustedInfo?.totalTickets ?? 0}
            </span>
            <span className="font-semibold text-gray-800">
              ${adjustedInfo?.seatPrice ?? "—"}
            </span>

            <div className="mt-2 flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2 border rounded-md"
              >
                <Minus size={18} />
              </button>

              <span className="font-semibold min-w-6 text-center">
                {quantity}
              </span>

              <button
                onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
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

MobileBookingBar.propTypes = {
  selectedShape: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
  }),
  ticketSetup: PropTypes.arrayOf(
    PropTypes.shape({
      sectionId: PropTypes.string.isRequired,
      availableTickets: PropTypes.number,
      totalTickets: PropTypes.number,
      perUserLimit: PropTypes.number,
      seatPrice: PropTypes.number,
    })
  ),
  eventSlug: PropTypes.string.isRequired,
  lockSection: PropTypes.func.isRequired,
  lockedSections: PropTypes.object,
};

export default MobileBookingBar;
