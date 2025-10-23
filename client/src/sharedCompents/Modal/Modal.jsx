import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

const Modal = ({ onClose, isOpen, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center bg-gray-600/75 justify-center z-50 "
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-lg p-6 w-11/12 max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
        >
          <X />
        </button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default Modal;
