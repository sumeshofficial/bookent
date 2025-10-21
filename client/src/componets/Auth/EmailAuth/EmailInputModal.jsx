import EmailFormSignUp from "./EmailFormSignUp";
import { useEffect, useState } from "react";
import EmailFormSignIn from "./EmailFormSignIn";
import { loginUserWithEmail, sendOTP } from "../../../services/auth";
import { useContextForm, useModal } from "../../../utils/constants";
import { Loader } from "lucide-react";
import { useDispatch } from "react-redux";
import { addUser } from "../../../Redux/authSlice";
import toast from "react-hot-toast";

const EmailInputFormModal = () => {
  const { openModal, closeModal } = useModal();
  const dispatch = useDispatch();
  const [form, setForm] = useState("signup");
  const { reset, watch, isSubmitting } = useContextForm();
  const [error, setError] = useState();

  useEffect(() => {
    const subscribe = watch((data) => {
      setError("");
    });

    return () => subscribe.unsubscribe();
  }, [watch]);

  const onSubmit = async (data) => {
    try {
      if (form === "signup") {
        const response = await sendOTP(data);
        toast.success("OTP sent successfully");
        reset();
        openModal("otp", { title: response, email: data.email, purpose: form });
      } else {
        const response = await loginUserWithEmail(data);
        reset();
        if (!response.data.isVerified) {
          return openModal("otp", {
            title: response.data.message,
            email: data.email,
            purpose: form,
          });
        }
        dispatch(addUser(response.data.user));
        localStorage.setItem("accessToken", response.data.accessToken);
        closeModal();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleForm = () => {
    setError("");
    reset();
    setForm((prev) => (prev === "signup" ? "signin" : "signup"));
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-11/12 max-w-md flex flex-col justify-between">
        {isSubmitting && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <Loader className="w-10 h-10 animate-spin text-violet-600" />
          </div>
        )}

        <span className="text-2xl my-3 font-bold text-center">
          {form === "signup" ? "SignUp with Email" : "SignIn with Email"}
        </span>
        {error && (
          <span className="text-red-500 text-center mt-5">{error}</span>
        )}
        {form === "signup" ? (
          <EmailFormSignUp onSubmit={onSubmit} />
        ) : (
          <EmailFormSignIn onSubmit={onSubmit} />
        )}

        <div
          onClick={handleForm}
          className="flex gap-1 my-3 justify-center hover:text-violet-500 cursor-pointer"
        >
          <span>
            {form === "signup"
              ? "Already have an account? Login"
              : "Create a new account"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmailInputFormModal;
