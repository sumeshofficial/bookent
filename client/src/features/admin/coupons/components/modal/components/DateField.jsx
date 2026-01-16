import PropTypes from "prop-types";
import FormField from "./FormField";

const DateField = ({ label, error, ...field }) => {
  return (
    <FormField label={label}>
      <div className="flex flex-col gap-1">
        <input
          type="date"
          {...field}
          className={`
            border p-2.5 rounded-lg
            focus:outline-none focus:ring-2
            ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }
          `}
        />

        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
      </div>
    </FormField>
  );
};

DateField.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.string,
};

export default DateField;
