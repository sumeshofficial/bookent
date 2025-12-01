import { ChevronDown, Info } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSectionLock } from "../hooks/useSeatLock";

const BookingBox = ({
  selectedShape,
  ticketSetup = [],
  shapes = [],
  eventId,
}) => {
  const navigate = useNavigate();
  const { lockSection } = useSectionLock(eventId);
  const index = selectedShape
    ? shapes.findIndex((s) => s.id === selectedShape.id)
    : -1;
  const info = index >= 0 ? ticketSetup?.[index] : null;

  const [qtyOpen, setQtyOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const maxQty = Math.min(info?.perUserLimit || 1, info?.availableTickets || 0);

  const handleSelectQty = (v) => {
    setQuantity(v);
    setQtyOpen(false);
  };

  const handleBookNow = async () => {
    console.log("clicked");
    lockSection(info.sectionId, quantity, (lockId) => {
      if (!lockId) {
        return;
      }

      // Save lock details
      localStorage.setItem("activeLockId", lockId);
      localStorage.setItem("selectedSection", info.sectionId);
      localStorage.setItem("selectedQuantity", quantity);

      // Redirect
      navigate(`/event/${eventId}/checkout`);
    });
  };

  return (
    <div className="w-full hidden lg:block lg:w-120 border rounded-xl shadow-md bg-white p-5 h-fit sticky top-5">
      {selectedShape ? (
        <>
          <h2 className="font-bold text-lg mb-2">{selectedShape.title}</h2>

          <p className="text-gray-600 mb-3">
            Available Seats: {info?.availableTickets ?? 0} /{" "}
            {info?.totalTickets ?? 0}
          </p>

          <p className="text-gray-800 mb-3 font-semibold">
            Price: ₹{info?.seatPrice ?? "—"}
          </p>

          <div className="mb-3 relative">
            <label className="block font-semibold mb-1">Quantity</label>

            <div
              className={`w-full border rounded-lg p-2 cursor-pointer flex justify-between items-center ${
                !info?.availableTickets ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() =>
                info?.availableTickets ? setQtyOpen(!qtyOpen) : null
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
            className="w-full py-3 bg-red-500 text-white rounded-lg text-lg font-semibold"
          >
            Book Now
          </button>
        </>
      ) : (
        <p className="text-gray-500 text-center py-2">Select a section</p>
      )}
    </div>
  );
};

export default BookingBox;
