import CouponForm from "./components/CouponForm";
import ModalHeader from "./components/ModalHeader";

const CreateCoupon = ({
  handleSubmit,
  onClose,
  isPending,
  coupon
}) => {
  return (
    <div>
      <ModalHeader onClose={onClose} />
      <CouponForm
        handleSubmit={handleSubmit}
        coupon={coupon}
        onClose={onClose}
        isPending={isPending}
      />
    </div>
  );
};

export default CreateCoupon;