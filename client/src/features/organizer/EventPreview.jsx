import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Info,
  AlertCircle,
  FileText,
  Tag,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { deleteEvent, getEvent } from "../../services/organization";
import toast from "react-hot-toast";
import { useModal } from "../../utils/constants";
import { useSelector } from "react-redux";

const EventPreview = () => {
  const [selectedTab, setSelectedTab] = useState("about");
  const [menuOpen, setMenuOpen] = useState(false);
  const { organizerId, eventSlug } = useParams();
  const { openModal, closeModal } = useModal();
  const { organizer } = useSelector((store) => store.organizer);

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  if (organizer && organizerId !== organizer._id) {
    navigate("/error");
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["event", eventSlug],
    queryFn: () => getEvent(eventSlug),
  });

  useEffect(() => {
    if (error) {
      console.log(error);
      toast.dismiss();
      toast.error("Something went wrong");
      navigate("/error");
    }
  }, [error, navigate]);

  const eventData = data?.event;

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatTime = (timeString) => {
    const [hrs, mins] = timeString.split(":");
    const hour = parseInt(hrs);
    return `${hour % 12 || 12}:${mins} ${hour >= 12 ? "PM" : "AM"}`;
  };

  const formatCurrency = (amt) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amt);

  const getAvailabilityPercentage = () =>
    ((eventData?.availableTickets / eventData?.totalTickets) * 100).toFixed(1);

  const handleEventDeleteMutation = useMutation({
    mutationFn: ({ eventId }) => deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
      navigate("/listmyshow/events");
      toast.dismiss();
      toast.success("Event deleted");
    },
    onError: (err) => {
      console.log(err);
      toast.dismiss();
      toast.error("Something went wrong");
    },
  });

  const handleDelete = async (id) => {
    handleEventDeleteMutation.mutate({
      eventId: id,
    });
  };

  return (
    <div className="min-h-screen bg-white px-5 rounded-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-end overflow-visible relative z-99999">
        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : (
          <div className="flex items-center gap-3 transition-opacity duration-700 opacity-0 animate-[fadeIn_0.7s_ease-in-out_forwards]">
            <button
              onClick={() =>
                navigate(`/listmyshow/event/${eventData._id}/tickets/verify`)
              }
              className="px-4 py-2 rounded-md bg-purple-600 text-white text-sm font-semibold hover:bg-purple-700 transition"
            >
              Verify Tickets
            </button>

            <div className="relative z-9999">
              <button
                className="p-2 rounded-full hover:bg-gray-200 transition"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.75a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM12 13.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM12 20.25a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
                  />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md z-99999">
                  <button
                    onClick={() => {
                      navigate(
                        `/listmyshow/organizer/${eventData.organizer}/event/${eventData.slug}/edit`
                      );
                      setMenuOpen((prev) => !prev);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-700"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      openModal("delete-confirmation", {
                        closeModal,
                        handleDelete,
                        id: eventData._id,
                      });
                      setMenuOpen((prev) => !prev);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 mb-10 transition-opacity duration-700 relative z-[1]">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          {isLoading ? (
            <>
              <div className="relative w-full aspect-video rounded-md overflow-hidden">
                <div className="w-full h-full bg-gray-200 animate-pulse rounded-md" />
              </div>

              <div className="bg-white rounded-lg shadow-md p-5 h-fit">
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="h-20 w-full bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-3"></div>
                <div className="h-3 w-full bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="h-24 w-full bg-gray-200 rounded animate-pulse"></div>
              </div>
            </>
          ) : (
            data && (
              <div className="transition-opacity duration-700 opacity-0 animate-[fadeIn_0.7s_ease-in-out_forwards]">
                <img
                  src={eventData?.bannerImage}
                  alt={eventData?.eventTitle}
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 sm:px-3 py-1 bg-purple-600 text-white rounded-full text-xs">
                      {eventData?.sportType}
                    </span>
                    <span
                      className={`px-2 sm:px-3 py-1 text-xs rounded-full ${
                        eventData?.eventStatus === "Published"
                          ? "bg-green-500"
                          : "bg-gray-500"
                      } text-white`}
                    >
                      {eventData?.eventStatus}
                    </span>
                  </div>

                  <h1 className="text-base sm:text-3xl font-bold text-white mb-2">
                    {eventData?.eventTitle}
                  </h1>

                  <div className="flex flex-wrap gap-2">
                    {eventData?.tags.map((t, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 text-white bg-white/20 rounded-full text-[.5rem] sm:text-xs"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-5 h-fit">
          {isLoading ? (
            <>
              <div className="animate-pulse bg-gray-200 rounded-md h-5 w-40 mb-4" />
              <div className="animate-pulse bg-gray-200 rounded-md h-16 w-full mb-4" />
              <div className="animate-pulse bg-gray-200 rounded-md h-5 w-32 mb-2" />
              <div className="animate-pulse bg-gray-200 rounded-md h-3 w-full mb-4" />
              <div className="animate-pulse bg-gray-200 rounded-md h-20 w-full" />
            </>
          ) : (
            data && (
              <div className="transition-opacity duration-700 opacity-0 animate-[fadeIn_0.7s_ease-in-out_forwards]">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Tickets Details
                </h2>

                <div className="bg-purple-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600">Ticket Price Range</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl sm:text-2xl font-bold text-purple-600">
                      {formatCurrency(eventData?.minPrice)}
                    </span>
                    <span>-</span>
                    <span className="text-xl sm:text-2xl font-bold text-purple-600">
                      {formatCurrency(eventData?.maxPrice)}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Tickets Available
                    </span>
                    <span className="font-bold ">
                      {eventData.availableTickets.toLocaleString()} /{" "}
                      {eventData.totalTickets.toLocaleString()}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-violet-500 h-3 rounded-full"
                      style={{ width: `${getAvailabilityPercentage()}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6 border-t pt-4 text-xs text-gray-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4" />
                    Event ID: #
                    {eventData.createdAt.split("T")[0].replace(/-/g, "")}
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Created: {formatDate(eventData.createdAt)}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {isLoading
            ? [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-200 rounded-md h-24 w-full"
                />
              ))
            : data &&
              [
                {
                  icon: Calendar,
                  label: "Match Date",
                  value: formatDate(eventData.matchDate),
                },
                {
                  icon: Clock,
                  label: "Match Time",
                  value: formatTime(eventData.matchTime),
                },
                {
                  icon: Clock,
                  label: "Gates Open",
                  value: formatTime(eventData.gateOpenTime),
                },
                {
                  icon: Clock,
                  label: "Duration",
                  value: `${eventData.matchDuration} minutes`,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow p-4 transition-opacity duration-700 opacity-0 animate-[fadeIn_0.7s_ease-in-out_forwards]"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <item.icon className="text-purple-600" size={20} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <p className="font-semibold text-sm sm:text-lg">
                    {item.value}
                  </p>
                </div>
              ))}
        </div>

        <div className="bg-white rounded-lg shadow p-5 transition-opacity duration-700 opacity-0 animate-[fadeIn_0.7s_ease-in-out_forwards]">
          {isLoading ? (
            <div className="animate-pulse bg-gray-200 rounded-md h-24 w-full" />
          ) : (
            data && (
              <>
                <h2 className="text-xl font-bold flex items-center gap-2 mb-3">
                  <MapPin className="text-purple-600" /> Venue
                </h2>
                <p className="font-semibold text-gray-800">
                  {eventData.stadiumName}
                </p>
                <p className="text-gray-600">{eventData.stadiumAddress}</p>
              </>
            )
          )}
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden transition-opacity duration-700 opacity-0 animate-[fadeIn_0.7s_ease-in-out_forwards]">
          {isLoading ? (
            <div className="animate-pulse bg-gray-200 rounded-md h-10 w-full" />
          ) : (
            data && (
              <div className="flex border-b">
                {["about", "policies"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`flex-1 text-xs sm:text-base px-4 py-3 sm:px-6  font-semibold transition ${
                      selectedTab === tab
                        ? "bg-purple-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {tab === "about" ? "About the Match" : "Policies & Terms"}
                  </button>
                ))}
              </div>
            )
          )}

          <div className="p-5">
            {isLoading ? (
              <div className="animate-pulse bg-gray-200 rounded-md h-40 w-full" />
            ) : selectedTab === "about" ? (
              data && (
                <div>
                  <h3 className="font-bold flex items-center gap-2 mb-2">
                    <Info className="text-purple-600" /> Event Description
                  </h3>
                  <p className="text-gray-700">{eventData.eventDescription}</p>
                </div>
              )
            ) : (
              data && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold flex items-center gap-2 mb-3">
                      <AlertCircle className="text-orange-600" /> Age
                      Restriction
                    </h3>
                    <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                      {eventData.ageRestriction}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold flex items-center gap-2 mb-3">
                      <FileText className="text-purple-600" /> Terms &
                      Conditions
                    </h3>
                    <div className="bg-gray-50 border p-4 rounded-lg whitespace-pre-line">
                      {eventData.termsAndConditions}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPreview;
