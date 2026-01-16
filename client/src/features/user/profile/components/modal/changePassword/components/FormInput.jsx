import { useState } from "react";
import PropTypes from "prop-types";
import { Eye, EyeOff } from "lucide-react";

const FormInput = ({
  label,
  type = "text",
  name,
  register,
  validation,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>

      <div className="relative">
        <input
          type={isPassword && showPassword ? "text" : type}
          {...register(name, validation)}
          className="w-full rounded-lg border px-3 py-2 pr-10
                     focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-2 flex items-center
                       text-gray-500 hover:text-gray-700"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

FormInput.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  register: PropTypes.func.isRequired,
  validation: PropTypes.object,
  error: PropTypes.string,
};

export default FormInput;
