import React, { useEffect, useState } from "react";
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
  const { organizerId, eventId } = useParams();
  const { openModal, closeModal } = useModal();
  const { organizer } = useSelector((store) => store.organizer);

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  if (organizer && organizerId !== organizer._id) {
    navigate("/error");
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["event", organizerId, eventId],
    queryFn: () => getEvent(organizerId, eventId),
  });

  useEffect(() => {
    if (error) {
      toast.dismiss();
      toast.error("Something went wrong");
      navigate("/error");
    }
  }, [error, navigate]);

  const eventData = data?.event;

  const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
  );

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
      currency: "INR",
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-end">
        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : (
          <div className="flex items-center gap-3 transition-opacity duration-700 opacity-0 animate-[fadeIn_0.7s_ease-in-out_forwards]">
            <button
              onClick={() =>
                navigate(
                  `/listmyshow/organizer/${eventData.organizer}/event/${eventData._id}/edit`
                )
              }
              className="px-4 py-2 bg-red-600 text-white rounded-md"
            >
              Edit
            </button>
            <button
              onClick={() =>
                openModal("delete-confirmation", {
                  closeModal,
                  handleDelete,
                  id,
                })
              }
              className="px-4 py-2 bg-black text-white rounded-md"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 mb-10 transition-opacity duration-700">
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
              <Skeleton className="h-5 w-40 mb-4" />
              <Skeleton className="h-16 w-full mb-4" />
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-3 w-full mb-4" />
              <Skeleton className="h-20 w-full" />
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
                      className="bg-green-500 h-3 rounded-full"
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
                <Skeleton key={i} className="h-24 w-full" />
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
            <Skeleton className="h-24 w-full" />
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
            <Skeleton className="h-10 w-full" />
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
              <Skeleton className="h-40 w-full" />
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
                      <AlertCircle className="text-blue-600" /> Refund Policy
                    </h3>
                    <div
                      className={`p-4 rounded-lg border ${
                        eventData.isRefundAvailable
                          ? "bg-green-50 border-green-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      {eventData.refundPolicy}
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
