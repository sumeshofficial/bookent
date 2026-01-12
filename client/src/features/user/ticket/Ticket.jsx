import { ChevronLeft, ChevronLeftCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../sharedComponents/user/navbar/Navbar";
import TicketCard from "./components/TicketCard";
import TicketDetails from "./components/TicketDeatils";
import useTicket from "./hooks/useTicket";

const Ticket = () => {
  const navigate = useNavigate();
  const { data, errors, isLoading } = useTicket();

  return (
    <>
      <Navbar />
      <div className="bg-gray-200 min-h-screen">
        <div className="px-10 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-base gap-2"
          >
            <ChevronLeft className="w-6 h-6" />
            <span>Back</span>
          </button>
        </div>
        <div className="flex justify-center pb-10 pt-5">
          {isLoading ? (
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-5xl flex flex-col md:flex-row overflow-hidden animate-pulse">
              <div className="w-full md:w-1/3 bg-gray-200 h-64 md:h-auto" />

              <div className="flex-1 p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-10 bg-gray-200 rounded w-full mt-6" />
                <div className="h-10 bg-gray-200 rounded w-full" />
              </div>
            </div>
          ) : errors ? (
            <div className="bg-white p-6 rounded-xl shadow text-center max-w-md">
              <h2 className="text-red-600 text-lg font-semibold mb-2">
                Something went wrong
              </h2>
              <p className="text-gray-600 text-sm">
                {errors?.message ||
                  "Unable to load ticket details. Please try again."}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-5xl flex flex-col md:flex-row items-start overflow-hidden">
              <TicketCard data={data} />
              <TicketDetails data={data} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Ticket;
