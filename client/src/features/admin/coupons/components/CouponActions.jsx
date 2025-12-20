const CouponActions = ({ onEdit, onToggle, onDelete }) => (
  <div className="flex gap-3">
    <button onClick={onEdit} className="text-blue-600 text-sm">
      Edit
    </button>
    <button onClick={onToggle} className="text-yellow-600 text-sm">
      Toggle
    </button>
    <button onClick={onDelete} className="text-red-600 text-sm">
      Delete
    </button>
  </div>
);

export default CouponActions;