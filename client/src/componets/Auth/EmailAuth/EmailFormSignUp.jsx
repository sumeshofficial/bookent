import InputBox from "../../../sharedCompents/InputBox";
import { useContextForm } from "../../../utils/constants";

const EmailFormSignUp = ({
  onSubmit
}) => {

  const { handleSubmit, isSubmitting, watch, register, errors } = useContextForm();
  const passwordValue = watch("password");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2 mt-5 mb-10">
        {/* Full Name Input */}
        <InputBox
          label="Full Name"
          type="text"
          name="fullname"
          validation={{
            required: "Full Name is required",
            minLength: {
              value: 3,
              message: "Full Name must be at least 3 characters",
            },
            pattern: {
              value: /^[A-Za-z\s]+$/,
              message: "Full Name can only contain letters and spaces",
            },
          }}
          register={register}
          errors={errors}
          placeholder="Enter your full name"
        />

        {/* Email Input */}
        <InputBox
          label="Email"
          type="email"
          name="email"
          validation={{
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          }}
          register={register}
          errors={errors}
          placeholder="Enter your email"
        />

        {/* Password Input */}
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
          placeholder="Enter your password"
        />

        {/* Confirm Password */}
        <InputBox
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          validation={{
            required: "Please confirm your password",
            validate: (value) =>
              value === passwordValue || "Passwords do not match",
          }}
          register={register}
          errors={errors}
          placeholder="Confirm your password"
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
    </form>
  );
};

export default EmailFormSignUp;