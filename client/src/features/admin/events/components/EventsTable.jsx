import EventRow from "./EventRow";
import EventsEmpty from "./EventsEmpty";

const EventsTable = ({ events }) => {
  if (!events.length) return <EventsEmpty />;

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Event</th>
            <th className="p-3">Sport</th>
            <th className="p-3">Stadium</th>
            <th className="p-3">Date</th>
            <th className="p-3">Price</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <EventRow key={event._id} event={event} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventsTable;
