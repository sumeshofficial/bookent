import { createPortal } from "react-dom";
import PropTypes from "prop-types";

const StatusDropdown = ({ onChange, buttonRect, onClose }) => {
  if (!buttonRect) return null;

  return createPortal(
    <div
      className="fixed"
      style={{
        zIndex: 9999,
        top: buttonRect.bottom + 6,
        left: buttonRect.left + buttonRect.width / 2,
        transform: "translateX(-50%)",
      }}
    >
      <div className="w-32 bg-white border rounded-md shadow-lg">
        <button
          onClick={() => {
            onChange(true);
            onClose();
          }}
          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
        >
          Active
        </button>
        <button
          onClick={() => {
            onChange(false);
            onClose();
          }}
          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
        >
          Inactive
        </button>
      </div>
    </div>,
    document.body
  );
};

StatusDropdown.propTypes = {
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  buttonRect: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
    bottom: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
  }),
};

export default StatusDropdown;
