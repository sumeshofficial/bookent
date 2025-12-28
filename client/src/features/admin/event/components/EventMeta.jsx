const EventMeta = ({ event }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow">
      <div>
        <p className="text-xs text-gray-500">Sport</p>
        <p className="font-medium">{event.sportType}</p>
      </div>

      <div>
        <p className="text-xs text-gray-500">Stadium</p>
        <p className="font-medium">{event.stadiumName}</p>
      </div>

      <div>
        <p className="text-xs text-gray-500">Match Date</p>
        <p className="font-medium">
          {new Date(event.matchDate).toLocaleDateString()} – {event.matchTime}
        </p>
      </div>
    </div>
  );
};

export default EventMeta;