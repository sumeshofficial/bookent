import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const InputBox = ({
  label,
  type,
  name,
  placeholder,
  validation,
  register,
  errors,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1 mb-4 w-full">
      <label htmlFor={name} className="text-gray-800 font-medium">
        {label}
      </label>

      <div className="relative w-full">
        <input
          id={name}
          type={inputType}
          {...register(name, validation)}
          placeholder={placeholder}
          className={`w-full border-2 p-2 rounded-md placeholder:text-gray-400 focus:outline-none transition pr-10 ${
            errors?.[name] ? "border-red-500" : "border-gray-700"
          }`}
        />

        {/* Password toggle */}
        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center justify-center px-3 text-gray-500"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* Error message */}
      {errors?.[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );
};

export default InputBox;
