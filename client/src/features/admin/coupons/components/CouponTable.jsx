import CouponActions from "./CouponActions";

const CouponTable = ({ coupons, onToggle, onDelete }) => {
  return (
    <table className="w-full hidden md:table">
      <thead className="bg-gray-100 text-sm text-gray-700">
        <tr>
          <th className="p-3 text-left">Code</th>
          <th className="p-3 text-center">Discount</th>
          <th className="p-3 text-center">Min Order</th>
          <th className="p-3 text-center">Usage</th>
          <th className="p-3 text-center">Expiry</th>
          <th className="p-3 text-center">Status</th>
          <th className="p-3 text-center">Actions</th>
        </tr>
      </thead>

      <tbody>
        {coupons.map((c) => (
          <tr key={c._id} className="border-t hover:bg-gray-50 transition">
            <td className="p-3 font-medium text-left">{c.code}</td>
            <td className="p-3 text-center whitespace-nowrap">
              {c.discountType === "PERCENTAGE"
                ? `${c.discountValue}%`
                : `₹${c.discountValue}`}
            </td>
            <td className="p-3 text-center whitespace-nowrap">
              ₹{c.minOrderAmount}
            </td>
            <td className="p-3 text-center whitespace-nowrap">
              {c.usedCount}/{c.usageLimit || "∞"}
            </td>
            <td className="p-3 text-center whitespace-nowrap">
              {c.expiryDate}
            </td>
            <td className="p-3 text-center">
              <span
                className={`inline-flex items-center justify-center px-2 py-1 rounded text-xs font-medium ${
                  c.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {c.isActive ? "ACTIVE" : "INACTIVE"}
              </span>
            </td>
            <td className="p-3">
              <div className="flex items-center justify-center">
                <CouponActions
                  onToggle={() => onToggle(c._id)}
                  onDelete={() => onDelete(c._id)}
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CouponTable;
