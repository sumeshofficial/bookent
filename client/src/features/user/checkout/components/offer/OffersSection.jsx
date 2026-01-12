import OfferButton from "./OfferButton";

const OffersSection = ({ grandTotal, onCouponApplied, onCouponRemoved }) => {
  return (
    <div className="space-y-3 pt-5">
      <h2 className="font-semibold text-xl">Apply Coupon</h2>

      <OfferButton
        grandTotal={grandTotal}
        onCouponApplied={onCouponApplied}
        onCouponRemoved={onCouponRemoved}
      />
    </div>
  );
};

export default OffersSection;
