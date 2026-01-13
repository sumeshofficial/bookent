import { Link } from "react-router-dom";
import { formatDate, formatTime } from "../../checkout/utils/dateTimeFormatter";
import TicketPricing from "./TicketPricing";
import TicketStatusBadge from "./TicketStatusBadge";

const TicketHeader = ({
  pricing,
  eventDetails,
  event,
  seat,
  status,
  ticketId,
}) => {
  const formattedMatchTime = formatTime(event.matchTime);
  const formattedDate = new Date(event.matchDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const { postponeDetails, cancelDetails } = event || {};

  const isPostponed = postponeDetails?.isPostponed;
  const isCancelled = cancelDetails?.isCancelled;
  return (
    <>
      {isCancelled && (
        <div className="w-full mb-2 rounded-md bg-red-100 border border-red-200 px-3 py-2 text-xs sm:text-sm">
          <p className="font-semibold text-red-700">Event Cancelled</p>

          {cancelDetails?.reason && (
            <p className="mt-1 text-red-600">Reason: {cancelDetails.reason}</p>
          )}
        </div>
      )}

      {isPostponed && (
        <div className="w-full mb-2 rounded-md bg-yellow-100 border border-yellow-200 px-3 py-2 text-xs sm:text-sm">
          <p className="font-semibold text-yellow-800">Event Postponed</p>

          {postponeDetails?.oldMatchDate && postponeDetails?.newMatchDate && (
            <p className="mt-1 text-yellow-700">
              {formatDate(postponeDetails.oldMatchDate)}
              {" → "}
              {formatDate(postponeDetails.newMatchDate)}
            </p>
          )}

          {postponeDetails?.reason && (
            <p className="mt-1 text-yellow-700">
              Reason: {postponeDetails.reason}
            </p>
          )}
        </div>
      )}

      <div className="flex flex-col items-center sm:items-start sm:flex-row gap-3 sm:gap-4">
        <Link to={`/ticket/${ticketId}`} className="block">
          <img
            src={eventDetails.thumbnailImage}
            alt="Match Poster"
            className="w-32 md:w-36 aspect-9/16 rounded-lg object-cover"
          />
        </Link>
        <div className="flex-1">
          <Link to={`/ticket/${ticketId}`} className="block">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
              <h2 className="text-sm sm:text-base md:text-xl font-semibold leading-snug">
                {eventDetails.title}
              </h2>
              <div>
                <TicketStatusBadge status={status} />
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {formattedDate} | {formattedMatchTime}
            </p>
            <p className="text-xs sm:text-sm text-gray-600">
              {event.stadiumAddress}
            </p>

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
    </>
  );
};

export default TicketHeader;
