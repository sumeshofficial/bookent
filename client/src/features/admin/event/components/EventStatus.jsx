import PropTypes from "prop-types";

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

EventStatus.propTypes = {
  event: PropTypes.shape({
    isBookingOpen: PropTypes.bool.isRequired,
    postponeDetails: PropTypes.shape({
      isPostponed: PropTypes.bool.isRequired,
    }).isRequired,
    cancelDetails: PropTypes.shape({
      isCancelled: PropTypes.bool.isRequired,
    }).isRequired,
  }).isRequired,
};

export default EventStatus;
