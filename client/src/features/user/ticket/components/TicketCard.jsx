import { formatDate } from "../../checkout/utils/dateTimeFormatter";
import { STATUS_MAP } from "../../myTickets/constants/ticketStatus";

const TicketCard = ({ data }) => {
  const { event, bookingId, paymentMethod, status, bookedAt } = data;
  const formattedDate = formatDate(bookedAt);
  return (
    <div className="md:w-1/3 bg-gray-50 p-6 flex flex-col items-center border-r">
      <img src={event.poster} alt="event poster" className="rounded-xl mb-4" />

      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          STATUS_MAP[status] || "bg-gray-100 text-gray-600"
        }`}
      >
        {status}
      </span>

      <div className="mt-6 text-sm text-gray-600 w-full space-y-2">
        <div>
          <p className="font-semibold">Booking Date</p>
          <p>{formattedDate}</p>
        </div>

        <div>
          <p className="font-semibold">Payment Method</p>
          <p>{paymentMethod}</p>
        </div>

        <div>
          <p className="font-semibold">Booking ID</p>
          <p className="font-mono">{bookingId}</p>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
