import { formatDate } from "../../../../utils/constants";
import { formatTime } from "../../../user/checkout/utils/dateTimeFormatter";
import { BOOKING_STATUS_COLOR } from "../constants/booking.constants";

const BookingRow = ({ booking }) => {
  const formattedDate = formatDate(booking.eventId.matchDate);
  const formattedTime = formatTime(booking.eventId.matchTime);

  return (
    <tr className="border-t hover:bg-gray-50">
      <td className="px-4 py-3 text-xs font-mono text-gray-700">
        {booking.orderId}
      </td>
      
      <td className="px-4 py-3">
        <p className="font-medium">{booking.eventDetails.title}</p>
        <p className="text-xs text-gray-500">{booking.eventDetails.venue}</p>
      </td>

      <td className="px-4 py-3">
        {formattedDate}
        <br />
        <span className="text-xs text-gray-500">{formattedTime}</span>
      </td>

      <td className="px-4 py-3">{booking.seat.category}</td>

      <td className="px-4 py-3">{booking.seat.qty}</td>

      <td className="px-4 py-3">${booking.pricingBreakDown.orderAmount}</td>

      <td className="px-4 py-3 font-semibold">
        ${booking.pricingBreakDown.grandTotal}
      </td>

      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 text-xs rounded ${
            BOOKING_STATUS_COLOR[booking.status]
          }`}
        >
          {booking.status}
        </span>
      </td>
    </tr>
  );
};

export default BookingRow;
