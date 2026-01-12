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

export default InputField;
