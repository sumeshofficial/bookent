import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  };
  return (
    <div
      onClick={() => navigate(`/event/${event.slug}`)}
      className="min-w-32 max-w-32 sm:min-w-55 sm:max-w-55 transition-opacity duration-700 opacity-0 animate-[fadeIn_0.7s_ease-in-out_forwards]"
    >
      <div className="w-full aspect-9/16 rounded-lg overflow-hidden bg-gray-200">
        <img
          src={event?.thumbnailImage}
          className="w-full h-full object-cover"
          alt={event?.eventTitle}
        />
      </div>

      <h3 className="mt-2 font-semibold text-gray-800 text-sm line-clamp-1">
        {event?.eventTitle}
      </h3>

      <p className="text-xs text-gray-500 line-clamp-1">
        {event?.stadiumName}, {event?.stadium?.stadiumDetails?.city}
      </p>
      <p className="text-xs text-gray-500 line-clamp-1">
        {formatShortDate(event?.matchDate)}
      </p>
    </div>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    thumbnailImage: PropTypes.string,
    eventTitle: PropTypes.string,
    matchDate: PropTypes.string,
    stadiumName: PropTypes.string,
    stadium: PropTypes.shape({
      stadiumDetails: PropTypes.shape({
        city: PropTypes.string,
      }),
    }),
  }).isRequired,
};

export default EventCard;
