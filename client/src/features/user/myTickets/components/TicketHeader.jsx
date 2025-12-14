import { Link } from "react-router-dom";
import { formatTime } from "../../checkout/utils/dateTimeFormatter";
import TicketPricing from "./TicketPricing";
import TicketStatusBadge from "./TicketStatusBadge";

const TicketHeader = ({ pricing, event, seat, status, ticketId }) => {
  const formattedMatchTime = formatTime(event.time);
  const formattedDate = new Date(event.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <div className="flex flex-col items-center sm:items-start sm:flex-row gap-3 sm:gap-4">
      <Link to={`/ticket/${ticketId}`} className="block">
        <img
          src={event.thumbnailImage}
          alt="Match Poster"
          className="w-32 md:w-36 aspect-9/16 rounded-lg object-cover"
        />
      </Link>
      <div className="flex-1">
        <Link to={`/ticket/${ticketId}`} className="block">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
            <h2 className="text-sm sm:text-base md:text-xl font-semibold leading-snug">
              {event.title}
            </h2>
            <div>
              <TicketStatusBadge status={status} />
            </div>
          </div>

          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {formattedDate} | {formattedMatchTime}
          </p>
          <p className="text-xs sm:text-sm text-gray-600">{event.venue}</p>

          <div className="mt-2 sm:mt-3 text-xs sm:text-sm">
            Tickets: <span className="font-medium">{seat.qty}</span>
          </div>

          <div className="text-xs sm:text-sm font-semibold mt-1">
            {seat.category}
          </div>
        </Link>
        <TicketPricing pricing={pricing} />
      </div>
    </div>
  );
};

export default TicketHeader;
