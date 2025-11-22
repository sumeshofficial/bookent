import {
  Calendar,
  Edit,
  Eye,
  MapPin,
  MoreVertical,
  Trash2,
  Users,
} from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../utils/constants";

const EventsCard = ({
  event,
  formatDate,
  setShowMenu,
  handleDelete,
  getBookingPercentage,
  formatCurrency,
  showMenu,
}) => {
  const { organizer } = useSelector((store) => store.organizer);
  const navigate = useNavigate();
  const { openModal, closeModal } = useModal();

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-opacity duration-700 opacity-0 animate-[fadeIn_0.7s_ease-in-out_forwards]">
      <div className="flex flex-col sm:flex-row">
        <div className="w-36 sm:w-36 md:w-38 lg:w-38 aspect-9/16 shrink-0 overflow-hidden rounded-md mx-auto">
          <img
            src={event.thumbnailImage}
            alt={event.eventTitle}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
            <div className="flex-1 w-full">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                  {event.eventTitle}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    event.eventStatus === "Published"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {event.eventStatus}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                  {event.sportType}
                </span>
              </div>
            </div>

            <div className="relative self-end sm:self-auto">
              <button
                onClick={() =>
                  setShowMenu(showMenu === event._id ? null : event._id)
                }
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <MoreVertical size={20} className="text-gray-600" />
              </button>

              {showMenu === event._id && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                  <button
                    onClick={() =>
                      navigate(
                        `/listmyshow/organizer/${organizer._id}/event/${event._id}`
                      )
                    }
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                  <button
                    onClick={() =>
                      navigate(
                        `/listmyshow/organizer/${organizer._id}/event/${event._id}/edit`
                      )
                    }
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
                  >
                    <Edit size={16} />
                    Edit Event
                  </button>
                  <button
                    onClick={() =>
                      openModal("delete-confirmation", {
                        handleDelete,
                        id: event._id,
                        closeModal
                      })
                    }
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
                {formatDate(event.matchDate)} at {event.matchTime}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={16} className="text-purple-600" />
              <span>{event.stadiumAddress}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users size={16} className="text-purple-600" />
              <span>
                {event.soldTickets} / {event.totalTickets} booked
              </span>
            </div>
          </div>

          {/* PROGRESS BAR */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Booking Progress</span>
              <span className="font-semibold">
                {getBookingPercentage(event.soldTickets, event.totalTickets)}%
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  event.soldTickets / event.totalTickets > 0.8
                    ? "bg-green-600"
                    : event.soldTickets / event.totalTickets > 0.5
                    ? "bg-orange-600"
                    : "bg-blue-600"
                }`}
                style={{
                  width: `${getBookingPercentage(
                    event.soldTickets,
                    event.totalTickets
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="w-full sm:hidden border border-gray-100 rounded-lg p-3 space-y-3 bg-gray-50">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">
                  Starting Price
                </span>
                <span className="text-gray-900 font-semibold">
                  ₹{event.minPrice}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">Total Revenue</span>
                <span className="text-green-600 font-semibold">
                  {formatCurrency(event.revenue)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">Created On</span>
                <span className="text-gray-800 font-semibold">
                  {formatDate(event.createdAt)}
                </span>
              </div>
            </div>

            <div className="hidden sm:flex gap-6">
              <div>
                <span className="text-xs text-gray-600 block">
                  Starting Price
                </span>
                <p className="text-lg font-bold text-gray-800">
                  ₹{event.minPrice}
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
                  {formatDate(event.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex gap-2 justify-end sm:justify-start">
              <button
                onClick={() =>
                  navigate(
                    `/listmyshow/organizer/${organizer._id}/event/${event._id}`
                  )
                }
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold flex items-center gap-2 text-sm"
              >
                <Eye size={16} />
                View
              </button>
              <button
                onClick={() =>
                  navigate(
                    `/listmyshow/organizer/${organizer._id}/event/${event._id}/edit`
                  )
                }
                className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold flex items-center gap-2 text-sm"
              >
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
