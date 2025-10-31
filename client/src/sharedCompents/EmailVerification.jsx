import { useContextForm } from "../utils/constants";
import InputBox from "./InputBox";
import { Loader } from "lucide-react";

const EmailVerification = ({ title, onSubmit, error }) => {
  const { register, errors, isSubmitting, handleSubmit } =
    useContextForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="sm:h-90 flex flex-col justify-between">
        {isSubmitting && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <Loader className="w-10 h-10 animate-spin text-violet-600" />
          </div>
        )}
        <div className="flex flex-col gap-2 mt-5 mb-10">
          <h2 className="text-2xl font-bold mb-3 text-center">
            {title}
          </h2>

          {error && <p className="text-red-500 mb-5">{error}</p>}

          {/* Email Input */}
          <InputBox
            label="Email"
            type="email"
            name="email"
            validation={{
              required: "Email is required",
            }}
            register={register}
            errors={errors}
            placeholder="Enter your email"
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

export default EmailVerification;
