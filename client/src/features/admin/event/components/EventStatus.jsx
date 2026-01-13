const EventStatus = ({ event }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-3">Event Status</h3>

      <ul className="text-sm space-y-2">
        <li>Booking Open: {event.isBookingOpen ? "Yes" : "No"}</li>
        <li>Postponed: {event.postponeDetails.isPostponed ? "Yes" : "No"}</li>
        <li>Cancelled: {event.cancelDetails.isCancelled ? "Yes" : "No"}</li>
      </ul>
    </div>
  );
};

export default EventStatus;
