import { useModal } from "../../../../../../utils/constants";
import { useCouponDelete } from "../../../hooks/useCouponDelete";
import { useCouponUpdate } from "../../../hooks/useCouponUpdate";
import { getChangedFields } from "../../../utils/getChangesFields";

import CouponMobileItem from "./CouponMobileItem";
import CouponMobileSkeleton from "./CouponMobileSkeleton";

const CouponMobileCard = ({ coupons = [], isLoading }) => {
  const { updateCoupon, isUpdating } = useCouponUpdate();
  const { deleteCoupon } = useCouponDelete();
  const { openModal, closeModal } = useModal();

  const editCoupon = (coupon) => (formData) => {
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
      handleSubmit: editCoupon(coupon),
      editingId: true,
      onClose: closeModal,
      isPending: isUpdating,
      coupon,
    });
  };

  if (isLoading) {
    return <CouponMobileSkeleton />;
  }

  if (!coupons.length) {
    return (
      <p className="md:hidden text-center text-gray-500 py-10">
        No coupons available
      </p>
    );
  }

  return (
    <div className="md:hidden space-y-3 p-3">
      {coupons.map((coupon) => (
        <CouponMobileItem
          key={coupon._id}
          coupon={coupon}
          onEdit={onEdit}
          onToggle={() =>
            updateCoupon({
              couponId: coupon._id,
              updateData: { isActive: !coupon.isActive },
            })
          }
          onDelete={() =>
            openModal("delete-confirmation", {
              title: "Delete Confirmation",
              message: "Are you sure you want to delete this coupon?",
              handleDelete: deleteCoupon,
              closeModal,
              id: coupon._id,
            })
          }
        />
      ))}
    </div>
  );
};

export default CouponMobileCard;