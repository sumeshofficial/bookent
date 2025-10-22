import { Loader } from "lucide-react";
import InputBox from "../../../sharedCompents/InputBox";
import { useContextForm, useModal } from "../../../utils/constants";
import { forgotPassword } from "../../../services/auth";
import { useState } from "react";
import toast from "react-hot-toast";

const ForgotPasswordInput = ({ response }) => {
  const { register, errors, isSubmitting, handleSubmit, reset, watch } =
    useContextForm();
  const { openModal } = useModal();
  const [error, setError] = useState();

  const passwordValue = watch("password");

  const onSubmit = async (data) => {
    try {
        const res = await forgotPassword({ email: response.user.email, password: data.password });
        console.log(res);
        toast.success(res.message)
        reset();
        openModal('signup');
    } catch (error) {
        setError(error.message);
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className=" flex flex-col justify-between">
        {isSubmitting && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <Loader className="w-10 h-10 animate-spin text-violet-600" />
          </div>
        )}
        <div className="flex flex-col gap-2 mt-5 mb-10">
          <h2 className="text-2xl font-bold mb-3 text-center">
            Forgot Password
          </h2>

          {error && <p className="text-red-500 mb-5">{error}</p>}

          {/* Password */}
          <InputBox
            label="Password"
            type="password"
            name="password"
            validation={{
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                message:
                  "Password must include uppercase, lowercase, number & special character",
              },
            }}
            register={register}
            errors={errors}
            placeholder="Enter your new password"
          />

          {/*Confirm Password */}
          <InputBox
            label="Confirm Password"
            type="password"
            name="confirm-password"
            validation={{
              required: "Please confirm your password",
              validate: (value) =>
                value === passwordValue || "Passwords do not match",
            }}
            register={register}
            errors={errors}
            placeholder="Confirm your new password"
          />
        </div>

        {/* Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full text-xl font-serif text-white bg-black py-2 rounded-xl transform transition duration-200 ease-in-out hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Continue"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ForgotPasswordInput;
