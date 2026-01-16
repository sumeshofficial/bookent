import PropTypes from "prop-types";

const TicketMeta = ({ meta }) => {
  const formattedDate = new Date(meta.bookingDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <div className="mt-5 pt-4 border-t grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600">
      <div>
        <p className="uppercase">Booking Date</p>
        <p className="font-medium text-black">{formattedDate}</p>
      </div>

      <div>
        <p className="uppercase">Payment</p>
        <p className="font-medium text-black">{meta.paymentMethod}</p>
      </div>

      <div>
        <p className="uppercase">Booking ID</p>
        <p className="font-medium text-black">{meta.bookingId}</p>
      </div>
    </div>
  );
};

TicketMeta.propTypes = {
  meta: PropTypes.shape({
    bookingDate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    paymentMethod: PropTypes.string.isRequired,
    bookingId: PropTypes.string.isRequired,
  }).isRequired,
};

export default TicketMeta;
