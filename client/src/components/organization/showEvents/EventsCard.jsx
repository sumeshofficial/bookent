import {
  Calendar,
  Edit,
  Eye,
  MapPin,
  MoreVertical,
  Trash2,
  Users,
} from "lucide-react";

const EventsCard = ({
  event,
  formatDate,
  setShowMenu,
  handleDelete,
  getBookingPercentage,
  formatCurrency,
  showMenu,
}) => {
  return (
    <div
      key={event.id}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-48 h-52 sm:h-48 shrink-0">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
            <div className="flex-1 w-full">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                  {event.title}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    event.status === "Published"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {event.status}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                  {event.sport}
                </span>
              </div>
            </div>

            <div className="relative self-end sm:self-auto">
              <button
                onClick={() =>
                  setShowMenu(showMenu === event.id ? null : event.id)
                }
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <MoreVertical size={20} className="text-gray-600" />
              </button>

              {showMenu === event.id && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm">
                    <Eye size={16} />
                    View Details
                  </button>
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm">
                    <Edit size={16} />
                    Edit Event
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center gap-2 text-sm text-red-600"
                  >
                    <Trash2 size={16} />
                    Delete Event
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={16} className="text-purple-600" />
              <span>
                {formatDate(event.date)} at {event.time}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={16} className="text-purple-600" />
              <span>
                {event.stadium}, {event.city}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users size={16} className="text-purple-600" />
              <span>
                {event.bookedSeats} / {event.totalSeats} booked
              </span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Booking Progress</span>
              <span className="font-semibold">
                {getBookingPercentage(event.bookedSeats, event.totalSeats)}%
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  event.bookedSeats / event.totalSeats > 0.8
                    ? "bg-green-600"
                    : event.bookedSeats / event.totalSeats > 0.5
                    ? "bg-orange-600"
                    : "bg-blue-600"
                }`}
                style={{
                  width: `${getBookingPercentage(
                    event.bookedSeats,
                    event.totalSeats
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="w-full space-y-2 sm:hidden">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Starting Price:</span>
                <span className="font-semibold text-gray-800">
                  ₹{event.price}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Revenue:</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(event.revenue)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Created On:</span>
                <span className="font-semibold text-gray-700 whitespace-nowrap">
                  {formatDate(event.createdOn)}
                </span>
              </div>
            </div>

            <div className="hidden sm:flex gap-6">
              <div>
                <span className="text-xs text-gray-600 block">
                  Starting Price
                </span>
                <p className="text-lg font-bold text-gray-800">
                  ₹{event.price}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-600 block">
                  Total Revenue
                </span>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(event.revenue)}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-600 block">Created On</span>
                <p className="text-sm font-medium text-gray-700">
                  {formatDate(event.createdOn)}
                </p>
              </div>
            </div>

            <div className="flex gap-2 justify-end sm:justify-start">
              <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold flex items-center gap-2 text-sm">
                <Eye size={16} />
                View
              </button>
              <button className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold flex items-center gap-2 text-sm">
                <Edit size={16} />
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsCard;
