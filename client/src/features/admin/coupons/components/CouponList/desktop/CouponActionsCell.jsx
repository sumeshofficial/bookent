import PropTypes from "prop-types";
import { Pencil, Trash2 } from "lucide-react";

const CouponActionsCell = ({
  coupon,
  onEdit,
  openModal,
  deleteCoupon,
  closeModal,
}) => {
  return (
    <td className="p-3 text-center">
      <div className="flex justify-center gap-2">
        <button
          onClick={() => onEdit(coupon)}
          title="Edit"
          className="p-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200"
        >
          <Pencil size={16} />
        </button>

        <button
          onClick={() =>
            openModal("delete-confirmation", {
              title: "Delete Confirmation",
              message: "Are you sure you want to delete this coupon?",
              handleDelete: deleteCoupon,
              closeModal,
              id: coupon._id,
            })
          }
          title="Delete"
          className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </td>
  );
};

CouponActionsCell.propTypes = {
  coupon: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  openModal: PropTypes.func.isRequired,
  deleteCoupon: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default CouponActionsCell;
