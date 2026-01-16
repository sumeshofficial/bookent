import PropTypes from "prop-types";

const InputField = ({
  type = "text",
  className = "",
  errors,
  register,
  name,
  rule,
  placeholder,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <input
        type={type}
        {...register(name, rule)}
        placeholder={placeholder}
        className={`
            border p-2.5 rounded-lg
            focus:outline-none focus:ring-2
            ${
              errors?.[name]
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }
            ${className}
          `}
      />

      {errors?.[name] && (
        <p className="text-xs text-red-600 font-medium">
          {errors[name]?.message}
        </p>
      )}
    </div>
  );
};

InputField.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  errors: PropTypes.object,
  register: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  rule: PropTypes.object,
  placeholder: PropTypes.string,
};

export default InputField;
