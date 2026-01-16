import PropTypes from "prop-types";
import CouponForm from "./components/CouponForm";
import ModalHeader from "./components/ModalHeader";

const CreateCoupon = ({ handleSubmit, onClose, isPending, coupon }) => {
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

CreateCoupon.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isPending: PropTypes.bool,
  coupon: PropTypes.object,
};

export default CreateCoupon;
