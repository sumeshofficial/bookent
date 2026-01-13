import { ChevronDown } from "lucide-react";
import { useState } from "react";
import StatusDropdown from "./StatusDropdown";

const CouponStatusCell = ({ coupon, updateCoupon }) => {
  const [open, setOpen] = useState(false);
  const [buttonRect, setButtonRect] = useState(null);

  return (
    <td className="p-3 text-center relative">
      <button
        type="button"
        onClick={(e) => {
          setButtonRect(e.currentTarget.getBoundingClientRect());
          setOpen((prev) => !prev);
        }}
        className={`flex items-center gap-1 mx-auto px-3 py-1 rounded-full text-xs font-medium
          ${
            coupon.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
      >
        {coupon.isActive ? "Active" : "Inactive"}
        <ChevronDown size={14} />
      </button>

      {open && (
        <StatusDropdown
          buttonRect={buttonRect}
          onClose={() => setOpen(false)}
          onChange={(value) => {
            updateCoupon({
              couponId: coupon._id,
              updateData: { isActive: value },
            });
            setOpen(false);
          }}
        />
      )}
    </td>
  );
};

export default CouponStatusCell;
