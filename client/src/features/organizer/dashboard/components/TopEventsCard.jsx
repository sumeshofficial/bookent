import PropTypes from "prop-types";

const TopEventsCard = ({ events = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h3 className="text-lg font-semibold mb-4">Top 5 Events</h3>

      {events.length === 0 ? (
        <p className="text-sm text-gray-500">No data available</p>
      ) : (
        <ul className="space-y-3">
          {events.map((event, index) => (
            <li
              key={event.eventId || event._id}
              className="flex items-center justify-between border-b last:border-b-0 pb-2"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-400">
                  #{index + 1}
                </span>

                {event.thumbnailImage ? (
                  <img
                    src={event.thumbnailImage}
                    alt="thumbnail"
                    className="w-8 h-8 rounded object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded bg-gray-200" />
                )}

                <div>
                  <p className="text-sm font-medium">
                    {event.eventTitle || event.eventSlug}
                  </p>
                  <p className="text-xs text-gray-500">
                    Tickets sold: {event.totalTicketsSold ?? 0}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-semibold text-green-600">
                  ${(event.organizerNetRevenue ?? 0).toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">
                  Gross: ${(event.grossTicketSales ?? 0).toFixed(2)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

TopEventsCard.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      eventId: PropTypes.string,
      _id: PropTypes.string,
      thumbnailImage: PropTypes.string,
      eventTitle: PropTypes.string,
      eventSlug: PropTypes.string,
      totalTicketsSold: PropTypes.number,
      organizerNetRevenue: PropTypes.number,
      grossTicketSales: PropTypes.number,
    })
  ),
};

export default TopEventsCard;
