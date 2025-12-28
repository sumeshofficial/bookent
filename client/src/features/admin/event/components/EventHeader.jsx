import { EVENT_STATUS_COLORS } from "../constants/event.constants";

const EventHeader = ({ title, status }) => {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      </div>

      <span
        className={`px-3 py-1 rounded text-sm font-medium ${
          EVENT_STATUS_COLORS[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status}
      </span>
    </div>
  );
};

export default EventHeader;