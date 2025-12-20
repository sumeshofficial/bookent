import CouponActions from "./CouponActions";

const CouponMobileCard = ({ coupons, onToggle, onDelete }) => {
  return (
    <div className="md:hidden space-y-3 p-3">
      {coupons.map((c) => (
        <div
          key={c._id}
          className="p-4 space-y-2 bg-white rounded-lg shadow-sm"
        >
          <div className="flex justify-between">
            <h3 className="font-semibold">{c.code}</h3>
            <span
              className={`text-xs px-2 py-0.5 rounded ${
                c.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {c.isActive ? "ACTIVE" : "INACTIVE"}
            </span>
          </div>

          <p className="text-xs text-gray-600">{c.description || "—"}</p>

          <CouponActions
            onToggle={() => onToggle(c._id)}
            onDelete={() => onDelete(c._id)}
          />
        </div>
      ))}
    </div>
  );
};

export default CouponMobileCard;