import BookingRow from "./BookingRow";
import Pagination from "../../../../sharedComponents/Pagination";

const BookingTable = ({ bookings, meta }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-3 text-left">OrderId</th>
            <th className="px-4 py-3 text-left">Event</th>
            <th className="px-4 py-3 text-left">Date & Time</th>
            <th className="px-4 py-3 text-left">Seat</th>
            <th className="px-4 py-3 text-left">Qty</th>
            <th className="px-4 py-3 text-left">Order Amount</th>
            <th className="px-4 py-3 text-left">Total Paid</th>
            <th className="px-4 py-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((booking) => (
            <BookingRow key={booking._id} booking={booking} />
          ))}
        </tbody>
      </table>
      <Pagination meta={meta} />
    </div>
  );
};

export default BookingTable;
