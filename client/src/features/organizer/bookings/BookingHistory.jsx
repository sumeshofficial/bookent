import BookingTable from "./components/BookingTable";
import BookingsFilter from "./components/filter/BookingsFilter";
import { useBookingHistory } from "./hooks/useBookingHistory";

const BookingHistory = () => {
  const { bookings, seatCategories, meta, loading } = useBookingHistory();

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-gray-900">
          Event Booking History
        </h1>
        <p className="text-sm text-gray-500">
          View, filter, and analyze bookings for this event
        </p>
      </div>

      <BookingsFilter seatCategories={seatCategories} />

      {loading ? (
        <div className="bg-white rounded-lg shadow p-4 animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      ) : (
        <BookingTable bookings={bookings} meta={meta} />
      )}

      {bookings.length === 0 && (
        <div className="text-center text-sm text-gray-500 py-10">
          No bookings found for the selected filters.
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
