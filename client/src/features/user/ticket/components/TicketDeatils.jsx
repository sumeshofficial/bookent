import QRCode from "react-qr-code";
import { formatDate, formatTime } from "../../checkout/utils/dateTimeFormatter";
import TicketPricing from "../../myTickets/components/TicketPricing";
import InvoiceActions from "./InvoiceActions";

const TicketDetails = ({ data }) => {
  const { event, qty, section, pricing, qrData, bookingId, status } = data;
  const formattedDate = formatDate(event.date);
  const formattedTime = formatTime(event.time);
  return (
    <div className="md:w-2/3 p-8">
      <h1 className="text-2xl font-bold mb-2">{event.title}</h1>

      <p className="text-gray-600">
        {formattedDate} · {formattedTime}
      </p>
      <p className="text-gray-600 mb-4">{event.venue}</p>

      <p className="text-sm text-gray-500 mb-2">
        Tickets: <span className="font-semibold">{qty}</span>
      </p>

      <h2 className="text-xl font-semibold mb-4">{section}</h2>

      {qrData && <QRCode value={qrData} size={150} />}

      <TicketPricing pricing={pricing} />

      {status === "CONFIRMED" && <InvoiceActions orderId={bookingId} />}
    </div>
  );
};

export default TicketDetails;
