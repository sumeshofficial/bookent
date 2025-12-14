import { Link } from "react-router-dom";
import TicketHeader from "./TicketHeader";
import TicketMeta from "./TicketMeta";

const TicketCard = ({ ticket }) => {
  return (
    <div className="flex justify-center px-2 sm:px-4 lg:px-6">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-full sm:max-w-xl md:max-w-3xl lg:max-w-5xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-3 sm:p-4 md:p-6">
            <TicketHeader
              pricing={ticket.pricingBreakDown}
              event={ticket.eventDetails}
              seat={ticket.seat}
              status={ticket.status}
              ticketId={ticket._id}
            />
            <Link to={`/ticket/${ticket._id}`} className="block">
              <TicketMeta
                meta={{
                  bookingId: ticket._id,
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

export default TicketCard;
