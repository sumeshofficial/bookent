import { Plus } from "lucide-react";
import { useModal } from "../../../../../utils/constants";
import { useCreateCoupon } from "../../hooks/useCreateCoupon";

const CouponHeader = () => {
  const { openModal, closeModal } = useModal();
  const { mutate: createCoupon, isPending } = useCreateCoupon();

  const onCreate = async (data) => {
    createCoupon(data, {
      onSuccess: () => {
        closeModal();
      },
    });
  };
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold">Coupon Management</h1>

      <button
        onClick={() =>
          openModal("create-coupon", {
            handleSubmit: onCreate,
            editingId: null,
            onClose: () => closeModal(),
            isPending,
          })
        }
        className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition btn-primary"
      >
        <Plus size={18} />
        <span className="hidden sm:block">Create Coupon</span>
      </button>
    </div>
  );
};

export default CouponHeader;
