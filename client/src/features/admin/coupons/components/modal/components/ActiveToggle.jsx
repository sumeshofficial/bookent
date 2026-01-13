const ActiveToggle = ({ checked, onChange }) => {
  return (
    <div className="md:col-span-2 flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
      <input
        type="checkbox"
        name="isActive"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4"
      />
      <span className="text-sm font-medium text-gray-700">
        Coupon is active
      </span>
    </div>
  );
};

export default ActiveToggle;
