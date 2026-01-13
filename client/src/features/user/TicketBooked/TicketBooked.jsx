import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTicketBooked } from "./hooks/useTicketBooked";
import TicketSkeleton from "./components/TicketSkeleton";
import TicketError from "./components/TicketError";
import TicketCard from "./components/TicketCard";
import LottieConfetti from "./components/animation/LottieConfetti";
import Navbar from "../../../sharedComponents/user/navbar/Navbar";
import useBackBlocker from "../payment/hooks/useBackBlocker";

const TicketBooked = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const { data, isLoading, error } = useTicketBooked(orderId);

  useBackBlocker();

  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/", { replace: true });
  };

  const content = isLoading ? (
    <TicketSkeleton />
  ) : error ? (
    <TicketError />
  ) : (
    <>
      <LottieConfetti />
      <TicketCard data={data} />
    </>
  );

  return (
    <div className="bg-gray-200 min-h-screen flex flex-col">
      <Navbar />
      <div className="p-10 flex-1">
        <div className="flex flex-col items-center mt-10 gap-6">
          {content}

          {!isLoading && !error && (
            <button
              onClick={handleBackHome}
              className="px-6 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
            >
              Back to Home
            </button>
          )}
        </div>
      </div>
      <div className="p-5 bg-white flex justify-center items-center">
        <p className="text-sm text-gray-500 flex items-center gap-1">
          © {new Date().getFullYear()}{" "}
          <span className="font-medium">Bookent</span>. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default TicketBooked;
