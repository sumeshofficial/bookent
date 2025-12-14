import { STATUS_MAP } from "../constants/ticketStatus";

const TicketStatusBadge = ({ status }) => {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        STATUS_MAP[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
};

export default TicketStatusBadge;