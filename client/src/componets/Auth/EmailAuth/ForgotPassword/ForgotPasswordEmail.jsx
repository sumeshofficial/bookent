import { useState } from "react";
import { sendOTP } from "../../../../services/auth";
import EmailVerification from "../../../../sharedCompents/EmailVerification";
import toast from "react-hot-toast";
import { useContextForm, useModal } from "../../../../utils/constants";

const ForgotPasswordEmail = () => {
  const { reset } = useContextForm();
  const { openModal } = useModal();

  const [error, setError] = useState();
  const onSubmit = async (data) => {
    try {
      setError("");
      const response = await sendOTP({ data, purpose: "forgot-password"});
      toast.success("OTP sent successfully");
      reset();
      openModal("otp", {
        title: response,
        email: data.email,
        purpose: "forgot-password",
      });
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div>
      <EmailVerification
        title={"Forgot Password"}
        onSubmit={onSubmit}
        error={error}
      />
    </div>
  );
};

export default ForgotPasswordEmail;
