import img from '../../assets/error-illustration.png'

const SeatLockErrorModal = ({ open, onClose, message }) => {
  if (!open) return null;

  return (
    <div>
      <div className="flex justify-center mb-6">
        <img
          src={img}
          alt="error"
          className="w-30 h-30 sm:w-55 sm:h-55 object-contain"
        />
      </div>

      <h2 className="text-base font-semibold text-center text-gray-900 mb-3">
        Sorry! Something is not right.
      </h2>

      <p className="text-sm text-gray-600 text-center leading-relaxed mb-8">
        {message ||
          "We're unable to lock these seats at the moment. Please try selecting different seats or refresh the page."}
      </p>

      <div className="flex justify-center">
        <button
          onClick={onClose}
          className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-base font-medium shadow-md hover:shadow-lg transition-all active:scale-95"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default SeatLockErrorModal;
