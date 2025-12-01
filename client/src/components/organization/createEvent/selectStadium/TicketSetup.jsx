import { useEffect } from "react";

const TicketSetup = ({
  title,
  register,
  errors,
  index,
  capacity,
  setValue,
  id,
}) => {
  useEffect(() => {
    setValue(`ticketSetup.${index}.totalTickets`, capacity, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (id) {
      setValue(`ticketSetup.${index}.sectionId`, id, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [capacity, id]);

  return (
    <>
      <div className="border-2 border-gray-200 p-3 sm:p-5 rounded-md sm:mt-3">
        <div className="flex flex-col sm:mt-5 gap-2 mb-2 sm:mb-5">
          <label className="text-xs sm:text-base">Section {index + 1}</label>
          <input
            type="text"
            disabled
            value={title}
            className="text-xs sm:text-base border-2 border-gray-200 py-1 px-2 sm:px-3 sm:py-2 rounded-sm sm:rounded-md text-gray-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2 sm:mb-5">
          <div className="flex flex-col gap-1 sm:gap-2">
            <label className="text-xs sm:text-base">Total Seats</label>
            <input
              type="number"
              readOnly
              {...register(`ticketSetup.${index}.totalTickets`, {
                valueAsNumber: true,
              })}
              className="text-xs sm:text-base border-2 border-gray-200 py-1 px-2 sm:px-3 sm:py-2 rounded-sm sm:rounded-md text-gray-500"
            />
          </div>

          <div className="flex flex-col gap-1 sm:gap-2">
            <div className="flex flex-col gap-1 sm:gap-2">
              <label className="text-xs sm:text-base">Available Tickets</label>
              <input
                type="number"
                {...register(`ticketSetup.${index}.availableTickets`, {
                  valueAsNumber: true,
                })}
                className="text-xs placeholder:text-gray-400 sm:text-base border-2 border-gray-200 py-1 px-2 sm:px-3 sm:py-2 rounded-sm sm:rounded-md focus:ring-2 focus:ring-violet-500 outline-none"
              />
            </div>
            {errors?.perUserLimit && (
              <span className="text-red-500 text-[.6rem] sm:text-[.8rem]">
                {errors.perUserLimit.message}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-2 sm:mb-5">
          <div className="flex flex-col gap-1 sm:gap-2">
            <label className="text-xs sm:text-base">Seats Per User</label>
            <input
              type="text"
              placeholder="E.g. 5"
              {...register(`ticketSetup.${index}.perUserLimit`, {
                valueAsNumber: true,
              })}
              className="text-xs placeholder:text-gray-400 sm:text-base border-2 border-gray-200 py-1 px-2 sm:px-3 sm:py-2 rounded-sm sm:rounded-md focus:ring-2 focus:ring-violet-500 outline-none"
            />

            {errors?.perUserLimit && (
              <span className="text-red-500 text-[.6rem] sm:text-[.8rem]">
                {errors.perUserLimit.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1 sm:gap-2">
            <label className="text-xs sm:text-base">Seat Price</label>
            <input
              type="text"
              placeholder="E.g. 150"
              {...register(`ticketSetup.${index}.seatPrice`, {
                valueAsNumber: true,
              })}
              className="text-xs placeholder:text-gray-400 sm:text-base border-2 border-gray-200 py-1 px-2 sm:px-3 sm:py-2 rounded-sm sm:rounded-md focus:ring-2 focus:ring-violet-500 outline-none"
            />

            {errors?.seatPrice && (
              <span className="text-red-500 text-[.6rem] sm:text-[.8rem]">
                {errors.seatPrice.message}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketSetup;
