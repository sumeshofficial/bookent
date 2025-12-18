import { X } from "lucide-react";

const ModalCloseButton = ({ onClose }) => (
  <button
    onClick={onClose}
    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700
               focus:outline-none focus:ring-2 focus:ring-gray-300 rounded"
    aria-label="Close"
  >
    <X size={20} />
  </button>
);

export default ModalCloseButton;
