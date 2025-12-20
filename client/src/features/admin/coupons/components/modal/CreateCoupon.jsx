import CouponForm from "./components/CouponForm";
import ModalHeader from "./components/ModalHeader";

const CreateCoupon = ({
  handleSubmit,
  editingId,
  onClose,
  isPending,
}) => {
  return (
    <div>
      <ModalHeader onClose={onClose} />
      <CouponForm
        handleSubmit={handleSubmit}
        editingId={editingId}
        onClose={onClose}
        isPending={isPending}
      />
    </div>
  );
};

export default CreateCoupon;
