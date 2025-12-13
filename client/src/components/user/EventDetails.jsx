import { Calendar, Clock, MapPin } from "lucide-react";
import { Hourglass, Users, Languages } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import EventRow from "../home/EventRow";
import { formatTime } from "../../features/user/checkout/utils/dateTimeFormatter";

const EventDetails = ({ event, recommendedEvents, isEventsLoading }) => {
  const {
    eventTitle,
    eventDescription,
    tags,
    minPrice,
    matchDate,
    matchTime,
    gateOpenTime,
    matchDuration,
    ageRestriction,
    termsAndConditions,
    stadiumName,
    stadium,
    stadiumAddress,
    bannerImage,
    soldTickets,
    totalTickets,
    availableTickets,
  } = event;

  const formattedMatchTime = formatTime(matchTime);
  const formattedGateTime = formatTime(gateOpenTime);

  const formattedDate = new Date(matchDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const navigate = useNavigate();

  const start = new Date(matchDate);

  const formattedStartDate = start.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const ageGroup = ageRestriction.toLowerCase().includes("not allowed")
    ? "Restricted entry"
    : "All age groups";

  const isFillingFast = soldTickets / totalTickets >= 0.6;

  const isSoldOut = availableTickets <= 0;
  const isCancelled = event?.eventStatus === "Cancelled";
  const isPostponed = event?.postponed?.isPostponed;
  const isNotLive = event?.eventStatus !== "Published";
  const isComingSoon = event?.eventStatus === "ComingSoon";
  const matchDateTime = new Date(`${matchDate}T${matchTime}`);
  const bookingCutoff = new Date(matchDateTime.getTime() - 30 * 60000);
  const isCutoffPassed = new Date() > bookingCutoff;

  const disableBooking =
    isSoldOut ||
    isCancelled ||
    isPostponed ||
    isNotLive ||
    isCutoffPassed ||
    isComingSoon;
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 transition-opacity duration-700 opacity-0 animate-[fadeIn_0.7s_ease-in-out_forwards]">
      <div className="relative pb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="aspect-video">
              <img
                src={bannerImage}
                alt={eventTitle}
                className="rounded-xl w-full h-full object-cover"
              />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold mt-8">{eventTitle}</h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-600 mt-4">
              <Link
                to={stadium.stadiumDetails.location}
                className="flex items-center gap-2"
              >
                <MapPin size={16} />
                <span>
                  {stadiumName}, {stadiumAddress}
                </span>
              </Link>

              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formattedDate}</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-10">About the Match</h2>
            <p className="text-gray-700 leading-relaxed mt-3">{eventDescription}</p>

            {tags?.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-200 rounded-full text-sm text-gray-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <h2 className="text-xl font-bold mt-8">Match Details</h2>

            <div className="mt-4 grid grid-cols-1 gap-5 text-gray-700">
              <div>
                <p>
                  <strong>Match Time:</strong> {formattedMatchTime}
                </p>
                <p>
                  <strong>Date:</strong> {formattedDate}
                </p>
                <p>
                  <strong>Gate Opens At:</strong> {formattedGateTime}
                </p>
                <p>
                  <strong>Match Duration:</strong> {matchDuration} minutes
                </p>
              </div>
            </div>

            <h2 className="text-xl font-bold mt-8">Terms & Conditions</h2>
            <p className="text-gray-700 mt-3 whitespace-pre-line">
              {termsAndConditions}
            </p>

            <h2 className="text-xl font-bold mt-8">Ticket Availability</h2>
            <p className="mt-2 text-gray-700">
              <strong>Available Tickets:</strong> {availableTickets}
            </p>

            <div className="h-10"></div>
          </div>

          <div className="bg-white sticky top-4 shadow-sm rounded-xl border py-8 sm:py-12 px-6 flex flex-col gap-3 justify-between max-h-[50vh] overflow-y-auto">
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-700" />
                <span className="text-gray-800 font-medium">
                  {formattedStartDate}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-700" />
                <span className="text-gray-800">{formattedMatchTime}</span>
              </div>

              <div className="flex items-start gap-3">
                <Hourglass className="w-5 h-5 text-gray-700" />
                <span className="text-gray-800">{matchDuration / 60} Hours</span>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-gray-700" />
                <span className="text-gray-800">{ageGroup}</span>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-700" />
                <Link
                  to={stadium.stadiumDetails.location}
                  className="text-gray-800"
                >
                  {stadiumName}
                </Link>
              </div>
            </div>

            <div>
              <hr className="my-4" />
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg">${minPrice} onwards</p>
                  {isFillingFast && (
                    <p className="text-orange-500 text-sm font-medium">
                      Filling Fast
                    </p>
                  )}
                </div>

                <button
                  disabled={disableBooking}
                  onClick={() => navigate("seat-layout")}
                  className={`px-5 py-2 rounded-lg text-base font-semibold ${
                    disableBooking
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-red-500 text-white hover:bg-red-600"
                  }`}
                >
                  {isComingSoon
                    ? "Coming Soon"
                    : isSoldOut
                    ? "Sold Out"
                    : isCancelled
                    ? "Cancelled"
                    : isPostponed
                    ? "Postponed"
                    : "Book Now"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {recommendedEvents.length > 0 && (
          <EventRow
            title="Recommended For You"
            events={recommendedEvents}
            seeAllLink="/events/recommended"
            loading={isEventsLoading}
          />
        )}
      </div>
    </div>
  );
};

export default EventDetails;
