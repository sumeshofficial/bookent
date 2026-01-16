import PropTypes from "prop-types";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const TicketPricing = ({ pricing }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-4">
      <div className="flex justify-between text-sm">
        <span>Order Amount</span>
        <span>$ {pricing.orderAmount}</span>
      </div>

      {pricing.discount > 0 && (
        <div className="flex justify-between text-sm text-green-600 mt-1">
          <span>Coupon Discount</span>
          <span>- $ {pricing.discount}</span>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-sm mt-2 font-medium"
      >
        <div className="flex items-center gap-1">
          Booking fee
          <span
            className={`transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          >
            <ChevronDown size={16} />
          </span>
        </div>
        <span>$ {pricing.bookingFee}</span>
      </button>

      {open && (
        <>
          <div className="mt-3 border-t pt-3 space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Base Fee</span>
              <span>$ {pricing.baseFee}</span>
            </div>
          </div>
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Gst</span>
              <span>$ {pricing.gst}</span>
            </div>
          </div>
        </>
      )}

      <div className="border-t border-dashed mt-4 pt-3 flex justify-between font-semibold">
        <span>{`Amount Paid ${pricing.discount > 0 ? "(After Discount)" : ""}`}</span>
        <span>$ {pricing.grandTotal}</span>
      </div>
    </div>
  );
};

TicketPricing.propTypes = {
  pricing: PropTypes.shape({
    orderAmount: PropTypes.number.isRequired,
    discount: PropTypes.number.isRequired,
    bookingFee: PropTypes.number.isRequired,
    baseFee: PropTypes.number.isRequired,
    gst: PropTypes.number.isRequired,
    grandTotal: PropTypes.number.isRequired,
  }).isRequired,
};

export default TicketPricing;

