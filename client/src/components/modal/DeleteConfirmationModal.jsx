import { useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";

const DeleteConfirmationModal = ({
  title = "Delete Confirmation",
  message = "Are you sure you want to delete this event?",
  handleDelete,
  closeModal,
  id,
}) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeModal]);

  const handleOnClick = () => {
    handleDelete(id);
    closeModal();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 animate-fadeIn">
      <div className="bg-white w-[90%] max-w-md rounded-xl shadow-lg p-6 animate-scaleIn relative">
        <button
          onClick={closeModal}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="flex justify-center mb-3">
          <AlertTriangle className="text-red-600" size={42} />
        </div>

        <h2 className="text-xl font-bold text-center text-gray-900 mb-2">
          {title}
        </h2>

        <p className="text-center text-gray-600 mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={closeModal}
            className="flex-1 py-2.5 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleOnClick}
            className="flex-1 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
