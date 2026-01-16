import PropTypes from "prop-types";
import { X } from "lucide-react";

const ModalHeader = ({ onClose }) => {
  return (
    <div className="flex items-center justify-end px-4 pt-4">
      <button
        type="button"
        onClick={onClose}
        className="p-2 rounded-full hover:bg-gray-100 transition"
        aria-label="Close modal"
      >
        <X className="h-5 w-5 text-gray-600" />
      </button>
    </div>
  );
};

ModalHeader.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ModalHeader;