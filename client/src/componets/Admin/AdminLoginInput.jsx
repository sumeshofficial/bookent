import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { clearError, loginAdmin } from "../../Redux/adminSlice";

const AdminLoginInput = () => {
  const dispatch = useDispatch();
  const { error } = useSelector((store) => store.admin);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
  });

  const email = watch("email");
  const password = watch("password");

  useEffect(() => {
    if (error && (email || password)) {
      dispatch(clearError());
    }
  }, [email, password, dispatch, error]);

  const onSubmit = (data) => {
    const { email, password } = data;
    dispatch(loginAdmin({ email, password }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email",
            },
          })}
          className={`w-full px-3 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 transition-all ${
            errors.email
              ? "border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:ring-blue-400"
          }`}
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          className={`w-full px-3 py-2 border rounded-md text-gray-800 focus:outline-none focus:ring-2 transition-all ${
            errors.password
              ? "border-red-500 focus:ring-red-400"
              : "border-gray-300 focus:ring-blue-400"
          }`}
          placeholder="Enter your password"
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white py-2.5 rounded-xl font-semibold text-base hover:opacity-90 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
      >
        Continue
      </button>
    </form>
  );
};

export default AdminLoginInput;
