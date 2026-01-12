import { Pencil, Power, Trash2 } from "lucide-react";

const CouponActions = ({ onEdit, onToggle, onDelete, coupon }) => (
  <div className="flex items-center gap-2">
    <button
      onClick={() => onEdit(coupon)}
      title="Edit coupon"
      className="p-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
    >
      <Pencil size={16} />
    </button>

    <button
      onClick={onToggle}
      title="Toggle status"
      className="p-2 rounded-md bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
    >
      <Power size={16} />
    </button>

    <button
      onClick={onDelete}
      title="Delete coupon"
      className="p-2 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition"
    >
      <Trash2 size={16} />
    </button>
  </div>
);

export default CouponActions;
