import { ChevronDown, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getStadiums } from "../../../services/organization";
import TicketSetup from "./selectStadium/TicketSetup";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";

const VenueAndTicket = ({ register, errors, watch, setValue }) => {
  const watchedStadiumId = watch("stadium");

  const { data } = useQuery({
    queryKey: ["stadiums"],
    queryFn: () => getStadiums(),
    keepPreviousData: true,
    onError: (error) => toast.error(error.message),
  });

  const stadiums = data?.data?.stadiums ?? [];
  const selectedStadium = useMemo(() => {
    return stadiums?.find((stadium) => stadium._id === watchedStadiumId);
  }, [stadiums, watchedStadiumId]);

  useEffect(() => {
    if (selectedStadium?.stadiumDetails) {
      setValue("stadiumName", selectedStadium?.stadiumDetails?.stadiumName);
      setValue("stadiumAddress", selectedStadium?.stadiumDetails?.address);
    }
  }, [selectedStadium, setValue]);

  return (
    <div className="bg-white border border-gray-100 rounded-md px-4 py-6 sm:px-8 sm:py-8">
      <span className="font-semibold text-sm sm:text-2xl">
        Venue & Map Details
      </span>

      <div className="mt-2 sm:mt-5 flex flex-col gap-2">
        <label className="text-[.7rem] sm:text-sm">Select Stadium</label>

        <div className="relative w-full">
          <select
            className="block w-full appearance-none rounded-md border border-gray-300 
               bg-white p-2 sm:py-3 sm:px-4 text-[.7rem] sm:text-base 
               text-gray-700 focus:border-violet-500 focus:ring-2 
               focus:ring-violet-400 transition-all duration-200 outline-none"
            {...register("stadium")}
          >
            <option value="" className="text-gray-300">
              Select Stadium/Create Stadium
            </option>
            {stadiums?.map((stadium) => (
              <option
                key={stadium._id}
                value={stadium._id}
                className="text-gray-800 hover:bg-violet-50"
              >
                {stadium?.stadiumDetails?.stadiumName}
              </option>
            ))}
          </select>

          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 
               w-3 h-3 sm:w-5 sm:h-5 text-gray-400 pointer-events-none"
          />
        </div>

        {errors?.stadium && (
          <span className="text-red-500 text-[.6rem] sm:text-sm">
            {errors.stadium.message}
          </span>
        )}

        {!watchedStadiumId && (
          <div className="flex justify-end mt-5">
            <div className="inline-block bg-linear-to-r from-violet-500 to-violet-800 p-0.5 rounded-lg">
              <Link
                to={"/listmyshow/stadium/create"}
                className="bg-white text-[.5rem] text-violet-700 font-semibold px-2 py-2 sm:px-4 sm:py-2 rounded-md hover:bg-violet-50 transition flex items-center gap-2 text-sm sm:text-base"
              >
                <Pencil className="w-3 h-3 sm:w-5 sm:h-5" />
                Create Stadium
              </Link>
            </div>
          </div>
        )}

        {selectedStadium && (
          <div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="w-full max-w-xl sm:mt-2">
                <div className="w-full overflow-hidden">
                  <img
                    src={selectedStadium.layoutImage}
                    alt="Stadium Layout Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="w-full border border-gray-200 rounded-lg p-3 sm:p-6 hover:shadow-md transition-all duration-200">
                <h3 className="text-xs sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-4 border-b border-gray-300 pb-1">
                  Stadium Details
                </h3>

                <div className="space-y-2 sm:space-y-3 text-[0.6rem] sm:text-base text-gray-700">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <p className="font-semibold text-gray-800">Stadium Name:</p>
                    <p className="truncate">
                      {selectedStadium.stadiumDetails.stadiumName}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <p className="font-semibold text-gray-800">Capacity:</p>
                    <p>
                      {selectedStadium.stadiumDetails.capacity?.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <p className="font-semibold text-gray-800">Address:</p>
                    <p className="truncate">
                      {selectedStadium.stadiumDetails.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-5">
              <div className="flex flex-col gap-1">
                <label className="text-xs sm:text-sm font-medium text-gray-700">
                  Min Seat Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    {...register("minPrice")}
                    className="w-full border border-gray-300 rounded-md pl-7 pr-3 py-2
                   sm:py-3 text-xs sm:text-base focus:ring-2 focus:ring-violet-500 outline-none placeholder:text-gray-400"
                    placeholder="0"
                  />
                </div>
                {errors?.minPrice && (
                  <span className="text-red-500 text-[0.6rem] sm:text-sm">
                    {errors.minPrice.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs sm:text-sm font-medium text-gray-700">
                  Max Seat Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    {...register("maxPrice")}
                    className="w-full border border-gray-300 rounded-md pl-7 pr-3 py-2 
                   sm:py-3 text-xs sm:text-base focus:ring-2 focus:ring-violet-500 outline-none placeholder:text-gray-400"
                    placeholder="250"
                  />
                </div>
                {errors?.maxPrice && (
                  <span className="text-red-500 text-[0.6rem] sm:text-sm">
                    {errors.maxPrice.message}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5">
              <h2 className="text-sm sm:text-2xl font-semibold">
                Ticket Setup
              </h2>

              <div className="grid sm:grid-cols-2 gap-2 sm:gap-3 mt-3">
                {selectedStadium.shapes
                  .filter((shape) => shape.type !== "image")
                  .map((shape, index) => (
                    <TicketSetup
                      key={shape.id}
                      id={shape.id}
                      title={shape.title}
                      register={register}
                      errors={errors.ticketSetup?.[index]}
                      index={index}
                      capacity={shape.capacity}
                      setValue={setValue}
                    />
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueAndTicket;
