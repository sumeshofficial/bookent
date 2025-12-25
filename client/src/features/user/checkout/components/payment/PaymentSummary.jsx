import PaymentDropdown from "./PaymentDropdown";
import PriceRow from "./PriceRow";

const PaymentSummary = ({ fees }) => {
  return (
    <div className="space-y-3 pt-6 border-t">
      <h2 className="font-semibold text-xl">Payment</h2>

      <PriceRow label="Order Amount" value={fees.orderAmount} />

      <PaymentDropdown
        label="Booking fee"
        value={fees.bookingFee}
        items={[
          { label: "Base fee", value: fees.baseFee },
          { label: "GST (18%)", value: fees.gst },
        ]}
      />

      {fees?.discount > 0 && (
        <PriceRow
          label="Discount"
          value={-fees.discount}
          className="text-green-600 font-medium"
        />
      )}
    </div>
  );
};

export default PaymentSummary;
