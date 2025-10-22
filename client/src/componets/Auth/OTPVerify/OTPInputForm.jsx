import { useEffect, useRef, useState } from "react";
import { onResend, verifyOtp } from "../../../services/auth";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../../../Redux/authSlice";
import { useModal } from "../../../utils/constants";
import toast from "react-hot-toast";

const OTP_DIGITS_COUNT = 6;
const RESEND_TIMEOUT = 60;

const OTPInputForm = ({ title, email, purpose }) => {
  const { openModal, closeModal } = useModal();
  const [inputArr, setInputArr] = useState(
    new Array(OTP_DIGITS_COUNT).fill("")
  );
  const [timer, setTimer] = useState(RESEND_TIMEOUT);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [stat, setStat] = useState({
    error: "",
    isLoading: false,
  });

  const refArr = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    refArr.current[activeIndex]?.focus();
  }, [stat]);

  useEffect(() => {
    const allFilled = inputArr.every((input) => input.trim() !== "");
    setIsButtonDisabled(!allFilled);
  }, [inputArr]);

  useEffect(() => {
    let intervalId;
    if (isDisabled) {
      intervalId = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId);
            setIsDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  }, [isDisabled]);

  const handleResendOTP = async () => {
    setIsDisabled(true);
    setTimer(RESEND_TIMEOUT);
    toast.success("OTP resend successfully");
    await onResend({ email, purpose });
  };

  const handleOnChange = (value, index) => {
    if (isNaN(value)) return;

    if (stat.error) {
      setStat({ ...stat, error: "" });
    }

    const newValue = value.trim();
    const newArr = [...inputArr];

    newArr[index] = newValue.slice(-1);

    setInputArr(newArr);

    const nextIndex = index + 1;
    if (newValue && nextIndex < OTP_DIGITS_COUNT) {
      setActiveIndex(nextIndex);
      refArr.current[nextIndex]?.focus();
    } else {
      setActiveIndex(index);
    }
  };

  const handleOnBlur = () => {
    setTimeout(() => {
      const index = Math.min(Math.max(activeIndex, 0), OTP_DIGITS_COUNT);
      refArr.current[index]?.focus();
    }, 0);
  };

  const handleOnKeyDown = (e, index) => {
    if (!e.target.value && e.key === "Backspace") {
      const prevIndex = Math.max(index - 1, 0);
      setActiveIndex(prevIndex);
      refArr.current[prevIndex]?.focus();
    }
  };

  const handleOTP = async () => {
    try {
      setStat({ ...stat, isLoading: true });
      const data = { otp: inputArr.join(""), email, purpose };
      const response = await verifyOtp(data);
      if (purpose === ("signup" || "signin")) {
        dispatch(addUser(response.user));
        localStorage.setItem("accessToken", response.accessToken);
        return closeModal();
      }
      openModal("forgot-password", { response });
    } catch (error) {
      setStat({ ...stat, isLoading: false, error: error.message });
      setIsButtonDisabled(true);
    }
  };

  return (
    <div className="w-full sm:h-90 flex justify-center mt-3 mb-5 px-4">
      <div className="w-full max-w-md flex flex-col justify-between">
        {stat.isLoading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <Loader className="w-10 h-10 animate-spin text-violet-600" />
          </div>
        )}

        {/* Title */}
        <div>
          <h1 className="text-2xl font-medium font-serif mt-5">
            Verify your Email
          </h1>
          <h1 className="text-sm mt-1 text-gray-500">{title}</h1>

          {/* OTP Input */}
          <div className="mt-5">
            {stat.error && <p className="text-red-500 mb-5">{stat.error}</p>}
            <div className="flex gap-1 sm:gap-3 mb-10">
              {inputArr.map((input, index) => (
                <input
                  key={index}
                  type="text"
                  ref={(input) => (refArr.current[index] = input)}
                  value={inputArr[index]}
                  onChange={(e) => handleOnChange(e.target.value, index)}
                  onKeyDown={(e) => handleOnKeyDown(e, index)}
                  onMouseDown={(e) => e.preventDefault()}
                  onBlur={() => handleOnBlur(index)}
                  className="border-2 text-2xl border-gray-700 text-center h-10 rounded-md w-10 focus:outline-none"
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          {/* ResendOTP */}
          <div className="flex justify-end">
            <button
              onClick={handleResendOTP}
              disabled={isDisabled}
              className={`rounded-md ${
                isDisabled && "cursor-not-allowed text-gray-500"
              }`}
            >
              {isDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
            </button>
          </div>

          {/* Button */}
          <div className="text-center mt-3">
            <button
              onClick={handleOTP}
              disabled={stat.isLoading || isButtonDisabled}
              type="submit"
              className="w-full text-xl font-serif text-white bg-black py-2 rounded-xl transform transition duration-200 ease-in-out hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {stat.isLoading ? "Verifying..." : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPInputForm;
