import { AlertTriangle } from "lucide-react";

const ConfirmBackModal = ({ open, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div className="select-none">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-red-100 rounded-full">
          <AlertTriangle className="text-red-600" size={24} />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          Leave this page?
        </h2>
      </div>

      <p className="text-gray-600 mt-4 leading-relaxed">
        Going back will clear your progress. Are you sure you want to continue?
      </p>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onConfirm}
          className="px-4 py-2 rounded-lg bg-white border border-red-500 text-red-500 "
        >
          Yes, go back
        </button>

        <button
          onClick={onCancel}
          className="px-8 py-2 rounded-lg bg-red-500 text-white hover:bg-red-700 transition"
        >
          No
        </button>
      </div>
    </div>
  );
};

export default ConfirmBackModal;
