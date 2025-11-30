const TicketCard = ({ data }) => {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-5">
      <h2 className="font-semibold text-xl">
        {data.title}
      </h2>

      <div className="text-sm mt-3 space-y-1">
        <p>Tickets: {data.count}</p>
        <p>{data.date}</p>
        <p>{data.time}</p>

        <p className="font-medium mt-3">Venue</p>
        <p>{data.venue}</p>

        <div className="bg-gray-100 rounded-md p-3 text-sm mt-3">
          {data.section}: {data.count} ticket(s)
        </div>
      </div>
    </div>
  );
};

export default TicketCard;