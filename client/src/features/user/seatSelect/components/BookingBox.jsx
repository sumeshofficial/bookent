import { ChevronDown, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSectionLock } from "../hooks/useSeatLock";

const BookingBox = ({
  selectedShape,
  ticketSetup = [],
  eventId,
  lockedSections,
}) => {
  const navigate = useNavigate();
  const { lockSection } = useSectionLock(eventId);

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

  const [qtyOpen, setQtyOpen] = useState(false);
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
  }, [selectedShape, adjustedInfo, maxQty, quantity]);

  const handleSelectQty = (v) => {
    setQuantity(v);
    setQtyOpen(false);
  };

  const handleBookNow = async () => {
    lockSection(adjustedInfo.sectionId, quantity, (lockId) => {
      if (!lockId) return;

      console.log(lockId);
      sessionStorage.setItem("lockId", lockId);

      navigate(`/event/${eventId}/checkout`);
    });
  };

  // Disable booking when no seats available
  const isSoldOut =
    (adjustedInfo?.availableTickets || 0) === 0 ||
    (maxQty || 0) === 0;

  return (
    <div className="w-full hidden lg:block lg:w-120 border rounded-xl shadow-md bg-white p-5 h-fit sticky top-5">
      {selectedShape ? (
        <>
          <h2 className="font-bold text-lg mb-2">{selectedShape.title}</h2>

          <p className="text-gray-600 mb-3">
            Available Seats: {adjustedInfo?.availableTickets ?? 0} /{" "}
            {adjustedInfo?.totalTickets ?? 0}
          </p>

          <p className="text-gray-800 mb-3 font-semibold">
            Price: ₹{adjustedInfo?.seatPrice ?? "—"}
          </p>

          <div className="mb-3 relative">
            <label className="block font-semibold mb-1">Quantity</label>

            <div
              className={`w-full border rounded-lg p-2 cursor-pointer flex justify-between items-center ${
                !adjustedInfo?.availableTickets
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={() =>
                adjustedInfo?.availableTickets ? setQtyOpen(!qtyOpen) : null
              }
            >
              <span>{quantity}</span>
              <ChevronDown className="w-5 h-4" />
            </div>

            {qtyOpen && (
              <div className="absolute left-0 right-0 bg-white border rounded-lg shadow-md mt-1 z-10 max-h-40 overflow-y-auto">
                {Array.from({ length: maxQty }).map((_, i) => (
                  <div
                    key={i + 1}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSelectQty(i + 1)}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleBookNow}
            disabled={isSoldOut}
            className={
              `w-full py-3 rounded-lg text-lg font-semibold ` +
              (isSoldOut
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-red-500 text-white")
            }
          >
            {isSoldOut ? "Sold Out" : "Book Now"}
          </button>
        </>
      ) : (
        <p className="text-gray-500 text-center py-2">Select a section</p>
      )}
    </div>
  );
};

export default BookingBox;
