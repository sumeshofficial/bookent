import { useEffect } from "react";
import { createPortal } from "react-dom";

const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    window.history.pushState({ modal: true }, "");

    const handlePopState = () => onClose?.();
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="
        fixed inset-0 z-50 bg-black/30
        flex items-center justify-center
        overflow-y-auto
      "
    >
      <div
        className="
          bg-white w-full sm:max-w-lg
          rounded-t-2xl sm:rounded-2xl
          max-h-[90vh] overflow-y-auto
          p-4 sm:p-6
        "
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default Modal;