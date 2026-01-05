import { Pencil, Trash2 } from "lucide-react";

const BannerActions = ({ onEdit, onDelete }) => {
  return (
    <div className="flex justify-end gap-3">
      <button
        type="button"
        onClick={onEdit}
        className="text-blue-600 hover:text-blue-800 transition"
        title="Edit banner"
      >
        <Pencil size={18} />
      </button>

      <button
        type="button"
        onClick={onDelete}
        className="text-red-600 hover:text-red-800 transition"
        title="Delete banner"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default BannerActions;
