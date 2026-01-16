import PropTypes from "prop-types";
import CouponInfoCell from "./CouponInfoCell";
import CouponStatusCell from "./CouponStatusCell";
import CouponActionsCell from "./CouponActionsCell";
import { getChangedFields } from "../../../utils/getChangesFields";

const CouponRow = ({
  coupon,
  updateCoupon,
  deleteCoupon,
  openModal,
  closeModal,
  isUpdating,
}) => {
  const editCoupon = (formData) => {
    const changedFields = getChangedFields(coupon, formData);

    if (Object.keys(changedFields).length === 0) {
      closeModal();
      return;
    }

    updateCoupon({
      couponId: coupon._id,
      updateData: changedFields,
    });

    closeModal();
  };

  const onEdit = (coupon) => {
    openModal("create-coupon", {
      handleSubmit: editCoupon,
      editingId: true,
      onClose: closeModal,
      isPending: isUpdating,
      coupon,
    });
  };

  return (
    <tr className="hidden md:table-row border-b hover:bg-gray-50 text-sm">
      <CouponInfoCell coupon={coupon} />

      <CouponStatusCell coupon={coupon} updateCoupon={updateCoupon} />

      <CouponActionsCell
        coupon={coupon}
        onEdit={onEdit}
        openModal={openModal}
        deleteCoupon={deleteCoupon}
        closeModal={closeModal}
      />
    </tr>
  );
};

CouponRow.propTypes = {
  coupon: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
  updateCoupon: PropTypes.func.isRequired,
  deleteCoupon: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
  isUpdating: PropTypes.bool,
};

export default CouponRow;
