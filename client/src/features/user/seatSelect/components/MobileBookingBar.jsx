import { Link } from "react-router-dom";

const MobileBookingBar = ({
  selectedShape,
  ticketSetup = [],
  shapes = [],
  eventId,
}) => {
  const index = selectedShape
    ? shapes.findIndex((s) => s.id === selectedShape.id)
    : -1;
  const info = index >= 0 ? ticketSetup?.[index] : null;

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
          </div>

          <Link to={`/event/${eventId}/checkout`}>
            <button className="py-3 px-6 bg-red-500 text-white rounded-lg text-lg font-semibold whitespace-nowrap">
              Book Now
            </button>
          </Link>
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
