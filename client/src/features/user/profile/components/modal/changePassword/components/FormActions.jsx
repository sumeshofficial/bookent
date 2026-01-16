import PropTypes from "prop-types";
const FormActions = ({ onCancel, isPending, isValid }) => {
  return (
    <div className="flex justify-end gap-3 mt-6 border-t pt-4">
      <button
        onClick={onCancel}
        className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={isPending || !isValid}
        className="px-5 py-2 text-sm rounded-lg
                 bg-blue-600 text-white font-medium
                 hover:bg-blue-700 transition disabled:opacity-50
                   disabled:cursor-not-allowed"
      >
        {isPending ? "Updating..." : "Update Password"}
      </button>
    </div>
  );
};


FormActions.propTypes = {
  onCancel: PropTypes.func.isRequired,
  isPending: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
};

export default FormActions;
