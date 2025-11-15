const MatchTime = ({ register, errors, watch }) => {
  console.log(watch("matchDate"))
  return (
    <div className="bg-white border border-gray-100 rounded-md px-4 py-6 sm:px-8 sm:py-8">
      <span className="font-semibold text-sm sm:text-2xl">Match Time</span>

      <div className="grid grid-cols-2 gap-3">
        <div className="mt-2 sm:mt-5 flex flex-col gap-2">
          <label className="text-[.7rem] sm:text-sm">Match Date</label>
          <input
            type="Date"
            {...register("matchDate")}
            className="border text-[.7rem] sm:text-base border-gray-200 rounded-md py-1 px-2 sm:py-3 sm:px-3 placeholder:text-gray-400 placeholder:text-[.5rem] sm:placeholder:text-base focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="E.g. 12/12/2025"
          />
          {errors?.matchDate && (
            <span className="text-red-500 text-[.5rem] sm:text-sm">
              {errors.matchDate.message}
            </span>
          )}
        </div>
        <div className="mt-2 sm:mt-5 flex flex-col gap-2">
          <label className="text-[.7rem] sm:text-sm">Staring Time</label>
          <input
            type="time"
            {...register("matchTime")}
            className="border text-[.7rem] sm:text-base border-gray-200 rounded-md py-1 px-2 sm:py-3 sm:px-3 placeholder:text-gray-400 placeholder:text-[.5rem] sm:placeholder:text-base focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="E.g. 14:00"
          />
          {errors?.matchTime && (
            <span className="text-red-500 text-[.5rem] sm:text-sm">
              {errors.matchTime.message}
            </span>
          )}
        </div>
        <div className="mt-2 sm:mt-5 flex flex-col gap-2">
          <label className="text-[.7rem] sm:text-sm">Gate Open Time </label>
          <input
            type="time"
            {...register("gateOpenTime")}
            className="border text-[.7rem] sm:text-base border-gray-200 rounded-md py-1 px-2 sm:py-3 sm:px-3 placeholder:text-gray-400 placeholder:text-[.5rem] sm:placeholder:text-base focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="E.g. 13:00"
          />
          {errors?.gateOpenTime && (
            <span className="text-red-500 text-[.5rem] sm:text-sm">
              {errors.gateOpenTime.message}
            </span>
          )}
        </div>
        <div className="mt-2 sm:mt-5 flex flex-col gap-2">
          <label className="text-[.7rem] sm:text-sm">Match Duration (m)</label>
          <input
            type="number"
            {...register("matchDuration", { valueAsNumber: true })}
            className="border text-[.7rem] sm:text-base border-gray-200 rounded-md py-1 px-2 sm:py-3 sm:px-3 placeholder:text-gray-400 placeholder:text-[.5rem] sm:placeholder:text-base focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="E.g. 120"
          />
          {errors?.matchDuration && (
            <span className="text-red-500 text-[.5rem] sm:text-sm">
              {errors.matchDuration.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchTime;
