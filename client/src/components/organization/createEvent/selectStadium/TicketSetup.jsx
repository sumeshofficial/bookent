const TicketSetup = ({ title, register, errors, index }) => {
  return (
    <>
      <div className="border-2 border-gray-200 p-3 sm:p-5 rounded-md sm:mt-3">
        <div className="flex flex-col sm:mt-5 gap-2 mb-2 sm:mb-5">
          <label className="text-[0.5rem] sm:text-base">
            Section {index + 1}
          </label>
          <input
            type="text"
            disabled
            value={title}
            className="text-[0.4rem] sm:text-base border-2 border-gray-200 py-1 px-2 sm:px-3 sm:py-2 rounded-sm sm:rounded-md text-gray-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2 sm:mb-5">
          <div className="flex flex-col gap-1 sm:gap-2">
            <label className="text-[0.5rem] sm:text-base">Total Seats</label>
            <input
              type="text"
              placeholder="E.g. 250"
              {...register(`ticketSetup.${index}.totalSeats`, { valueAsNumber: true })}
              className="text-[0.4rem] placeholder:text-gray-400 sm:text-base border-2 border-gray-200 py-1 px-2 sm:px-3 sm:py-2 rounded-sm sm:rounded-md"
            />

            {errors?.totalSeats && (
              <span className="text-red-500 text-[.4rem] sm:text-[.8rem]">
                {errors.totalSeats.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1 sm:gap-2">
            <label className="text-[0.5rem] sm:text-base">Seat Price</label>
            <input
              type="text"
              placeholder="E.g. 150"
              {...register(`ticketSetup.${index}.seatPrice`, { valueAsNumber: true })}
              className="text-[0.4rem] placeholder:text-gray-400 sm:text-base border-2 border-gray-200 py-1 px-2 sm:px-3 sm:py-2 rounded-sm sm:rounded-md"
            />

            {errors?.seatPrice && (
              <span className="text-red-500 text-[.4rem] sm:text-[.8rem]">
                {errors.seatPrice.message}
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2 sm:mb-5">
          <div className="flex flex-col gap-1 sm:gap-2">
            <label className="text-[0.5rem] sm:text-base">
              Total Seats Per User
            </label>
            <input
              type="text"
              placeholder="E.g. 5"
              {...register(`ticketSetup.${index}.perUserLimit`, { valueAsNumber: true })}
              className="text-[0.4rem] placeholder:text-gray-400 sm:text-base border-2 border-gray-200 py-1 px-2 sm:px-3 sm:py-2 rounded-sm sm:rounded-md"
            />

            {errors?.perUserLimit && (
              <span className="text-red-500 text-[.4rem] sm:text-[.8rem]">
                {errors.perUserLimit.message}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketSetup;
