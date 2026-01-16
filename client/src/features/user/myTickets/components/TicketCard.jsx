import { Link } from "react-router-dom";
import TicketHeader from "./TicketHeader";
import TicketMeta from "./TicketMeta";
import PropTypes from "prop-types";

const TicketCard = ({ ticket }) => {
  return (
    <div className="flex justify-center px-2 sm:px-4 lg:px-6">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-5xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-3 sm:p-4 md:p-6">
            <TicketHeader
              pricing={ticket.pricingBreakDown}
              eventDetails={ticket.eventDetails}
              event={ticket.event}
              seat={ticket.seat}
              status={ticket.status}
              ticketId={ticket.orderId}
            />
            <Link to={`/ticket/${ticket.orderId}`} className="block">
              <TicketMeta
                meta={{
                  bookingId: ticket.orderId,
                  paymentMethod: ticket.paymentMethod,
                  bookingDate: ticket.createdAt,
                }}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

TicketCard.propTypes = {
  ticket: PropTypes.shape({
    pricingBreakDown: PropTypes.object,
    eventDetails: PropTypes.object,
    event: PropTypes.object,
    seat: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    status: PropTypes.string,
    orderId: PropTypes.string.isRequired,
    paymentMethod: PropTypes.string,
    createdAt: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
  }).isRequired,
};

export default TicketCard;
