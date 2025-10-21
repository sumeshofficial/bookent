import InputBox from "../../../sharedCompents/InputBox";
import { useContextForm } from "../../../utils/constants";

const EmailFormSignIn = ({ onSubmit }) => {
  const { register, errors, isSubmitting, handleSubmit } = useContextForm();
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2 mt-5 mb-10">
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

        <InputBox
          label="Password"
          type="password"
          name="password"
          validation={{
            required: "Password is required",
          }}
          register={register}
          errors={errors}
          placeholder="Enter your password"
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

export default EmailFormSignIn;
