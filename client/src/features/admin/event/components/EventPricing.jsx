import PropTypes from "prop-types";

const EventPricing = ({
  minPrice,
  maxPrice,
  ticketSetup = [],
  shapes = [],
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-3">Ticket Pricing</h3>

      <p className="text-sm mb-4">
        Price Range: <b>${minPrice}</b> – <b>${maxPrice}</b>
      </p>

      <div className="space-y-3">
        {ticketSetup.map((ticket, index) => {
          const sectionTitle = shapes[index]?.title || `Section ${index + 1}`;

          return (
            <div
              key={ticket.sectionId}
              className="flex items-center justify-between text-sm border-b pb-2"
            >
              <div>
                <p className="font-medium text-gray-800">{sectionTitle}</p>
                <p className="text-xs text-gray-500">
                  Max {ticket.perUserLimit} tickets per user
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  ${ticket.seatPrice}
                </p>
                <p className="text-xs text-gray-500">
                  {ticket.availableTickets} / {ticket.totalTickets} available
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

EventPricing.propTypes = {
  minPrice: PropTypes.number.isRequired,
  maxPrice: PropTypes.number.isRequired,

  ticketSetup: PropTypes.arrayOf(
    PropTypes.shape({
      sectionId: PropTypes.string.isRequired,
      seatPrice: PropTypes.number.isRequired,
      perUserLimit: PropTypes.number.isRequired,
      availableTickets: PropTypes.number.isRequired,
      totalTickets: PropTypes.number.isRequired,
    })
  ),

  shapes: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
    })
  ),
};

export default EventPricing;