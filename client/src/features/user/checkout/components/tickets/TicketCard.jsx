import { formatDate, formatTime } from "../../utils/dateTimeFormatter";

const TicketCard = ({ data, isLoading }) => {
  const formattedDate = formatDate(data?.date);
const formattedTime = formatTime(data?.time);

  return (
    <div className="bg-white rounded-xl border shadow-sm p-5">
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-1/2"></div>

          <div className="space-y-2 mt-3">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/5"></div>

            <div className="h-5 bg-gray-300 rounded w-20 mt-3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>

            <div className="bg-gray-200 rounded-md p-4 mt-4">
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <h2 className="font-semibold text-xl">{data.title}</h2>

          <div className="text-sm mt-3 space-y-1">
            <p>Tickets: {data.count}</p>
            <p>{formattedDate}</p>
            <p>{formattedTime}</p>

            <p className="font-medium mt-3">Venue</p>
            <p>{data.venue}</p>

            <div className="bg-gray-100 rounded-md p-3 text-sm mt-3">
              {data.section}: {data.count} ticket(s)
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TicketCard;