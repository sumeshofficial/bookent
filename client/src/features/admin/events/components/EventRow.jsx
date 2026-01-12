import React from "react";
import { useNavigate } from "react-router-dom";

const EventRow = ({ event }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/admin/events/${event.slug}`);
  };

  return (
    <tr
      role="button"
      tabIndex={0}
      onClick={handleNavigate}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleNavigate();
        }
      }}
      className="border-b cursor-pointer hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
    >
      <td className="p-3 font-medium">{event.eventTitle}</td>
      <td className="p-3">{event.sportType}</td>
      <td className="p-3">{event.stadiumName}</td>
      <td className="p-3">{new Date(event.matchDate).toLocaleDateString()}</td>
      <td className="p-3">
        ${event.minPrice} - ${event.maxPrice}
      </td>
      <td className="p-3">
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            event.eventStatus === "Published"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {event.eventStatus}
        </span>
      </td>
    </tr>
  );
};

export default EventRow;
