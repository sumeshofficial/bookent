const CouponHeader = ({ code, isActive }) => {
  return (
    <div className="flex items-center justify-between">
      <h3 className="font-semibold text-sm">{code}</h3>

      <span
        className={`text-xs px-2 py-0.5 rounded font-medium ${
          isActive
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {isActive ? "ACTIVE" : "INACTIVE"}
      </span>
    </div>
  );
};

export default CouponHeader;