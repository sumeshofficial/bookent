import PropTypes from "prop-types";
import QRCode from "react-qr-code";
import { formatDate, formatTime } from "../../checkout/utils/dateTimeFormatter";
import TicketPricing from "../../myTickets/components/TicketPricing";
import InvoiceActions from "./InvoiceActions";

const TicketDetails = ({ data }) => {
  const {
    event,
    qty,
    section,
    pricing,
    qrData,
    bookingId,
    status,
    postponeDetails,
    cancelDetails,
  } = data;

  const isPostponed = postponeDetails?.isPostponed;
  const isCancelled = cancelDetails?.isCancelled;

  const formattedDate = formatDate(event.date);
  const formattedTime = formatTime(event.time);
  return (
    <div className="md:w-2/3 p-8">
      {isCancelled && (
        <div className="mb-4 rounded-md bg-red-100 border border-red-200 px-3 py-2 text-sm">
          <p className="font-semibold text-red-700">Event Cancelled</p>
          {cancelDetails?.reason && (
            <p className="text-red-600 mt-1">Reason: {cancelDetails.reason}</p>
          )}
        </div>
      )}

      {isPostponed && (
        <div className="mb-4 rounded-md bg-yellow-100 border border-yellow-200 px-3 py-2 text-sm">
          <p className="font-semibold text-yellow-800">Event Postponed</p>
          {postponeDetails?.oldMatchDate && postponeDetails?.newMatchDate && (
            <p className="text-yellow-700 mt-1">
              {formatDate(postponeDetails.oldMatchDate)} →{" "}
              {formatDate(postponeDetails.newMatchDate)}
            </p>
          )}
          {postponeDetails?.reason && (
            <p className="text-yellow-700 mt-1">
              Reason: {postponeDetails.reason}
            </p>
          )}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-2">{event.title}</h1>

      <p className="text-gray-600">
        {formattedDate} · {formattedTime}
      </p>
      <p className="text-gray-600 mb-4">{event.venue}</p>

      <p className="text-sm text-gray-500 mb-2">
        Tickets: <span className="font-semibold">{qty}</span>
      </p>

      <h2 className="text-xl font-semibold mb-4">{section}</h2>

      {qrData && !isCancelled && !isPostponed && (
        <QRCode value={qrData} size={150} />
      )}

      <TicketPricing pricing={pricing} />

      {status === "CONFIRMED" && <InvoiceActions orderId={bookingId} />}
    </div>
  );
};

TicketDetails.propTypes = {
  data: PropTypes.shape({
    event: PropTypes.shape({
      title: PropTypes.string.isRequired,
      date: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      time: PropTypes.string.isRequired,
      venue: PropTypes.string.isRequired,
    }).isRequired,
    qty: PropTypes.number.isRequired,
    section: PropTypes.string.isRequired,
    pricing: PropTypes.object.isRequired,
    qrData: PropTypes.string,
    bookingId: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    postponeDetails: PropTypes.shape({
      isPostponed: PropTypes.bool,
      oldMatchDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      newMatchDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      reason: PropTypes.string,
    }),
    cancelDetails: PropTypes.shape({
      isCancelled: PropTypes.bool,
      reason: PropTypes.string,
    }),
  }).isRequired,
};

export default TicketDetails;
