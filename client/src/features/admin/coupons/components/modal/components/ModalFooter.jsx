import PropTypes from "prop-types";

const ModalFooter = ({ onClose, isPending, coupon }) => {
  return (
    <div className="md:col-span-2 flex justify-end gap-3 pt-5 border-t mt-2">
      <button
        type="button"
        onClick={onClose}
        className="bg-gray-100 hover:bg-gray-200 transition px-5 py-2 rounded-lg font-medium"
      >
        Cancel
      </button>

      <button
        disabled={isPending}
        className="bg-blue-600 hover:bg-blue-700 transition text-white text-base px-3 sm:px-6 py-2.5 rounded-lg font-semibold shadow disabled:opacity-50"
      >
        {isPending
          ? coupon
            ? "Updating..."
            : "Creating..."
          : coupon
          ? "Update Coupon"
          : "Create Coupon"}
      </button>
    </div>
  );
};

ModalFooter.propTypes = {
  onClose: PropTypes.func.isRequired,
  isPending: PropTypes.bool.isRequired,
  coupon: PropTypes.object,
};

export default ModalFooter;