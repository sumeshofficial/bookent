import { ChevronDown } from "lucide-react";

const PublishAndPreview = ({ register, errors, watch }) => {

  return (
    <div className="bg-white border border-gray-100 rounded-md px-4 py-6 sm:px-8 sm:py-8 space-y-3 sm:space-y-5">
      <h2 className="font-semibold text-sm sm:text-2xl">Policies & Publish</h2>

      <div className="mt-2 sm:mt-5 flex flex-col gap-2">
        <label className="text-xs sm:text-sm">Age Restriction</label>
        <input
          type="text"
          placeholder="e.g., 12+ years allowed"
          {...register("ageRestriction")}
          className="border text-xs sm:text-base border-gray-200 rounded-md py-2 px-2 sm:py-3 sm:px-3 placeholder:text-gray-400 placeholder:text-xs sm:placeholder:text-base focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        {errors?.ageRestriction && (
          <span className="text-red-500 text-[.5rem] sm:text-sm">
            {errors.ageRestriction.message}
          </span>
        )}
      </div>

      <div className="mt-2 sm:mt-5 flex gap-2">
        <label className="text-xs sm:text-sm">Refund Available</label>
        <input
          type="checkbox"
          {...register("refund")}
          className="border text-xs sm:text-base border-gray-200 rounded-md py-2 px-2 sm:py-3 sm:px-3 placeholder:text-gray-400 placeholder:text-xs sm:placeholder:text-base focus:outline-none"
        />
        {errors?.refund && (
          <span className="text-red-500 text-[.5rem] sm:text-sm">
            {errors.refund.message}
          </span>
        )}
      </div>

      <div className="mt-2 sm:mt-5 flex flex-col gap-2">
        <label className="text-xs sm:text-sm">Refund Policy</label>
        <textarea
          {...register("refundPolicy")}
          placeholder="e.g., No refund after booking. Tickets are non-transferable."
          className="border text-xs sm:text-base border-gray-200 h-20 sm:h-30 rounded-md py-2 px-2 sm:py-3 sm:px-3 placeholder:text-gray-400 placeholder:text-xs sm:placeholder:text-base focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
        />
        {errors?.refundPolicy && (
          <span className="text-red-500 text-[.5rem] sm:text-sm">
            {errors.refundPolicy.message}
          </span>
        )}
      </div>

      <div className="mt-2 sm:mt-5 flex flex-col gap-2">
        <label className="text-xs sm:text-sm">Terms & Conditions</label>
        <textarea
          {...register("termsAndConditions")}
          placeholder="Enter terms and conditions for ticket holders"
          className="border text-xs sm:text-base border-gray-200 h-20 sm:h-30 rounded-md py-2 px-2 sm:py-3 sm:px-3 placeholder:text-gray-400 placeholder:text-xs sm:placeholder:text-base focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
        />
        {errors?.termsAndConditions && (
          <span className="text-red-500 text-[.5rem] sm:text-sm">
            {errors.termsAndConditions.message}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2">
        <div className="relative">
          <label className="block text-sm font-medium mb-2">Status</label>

          <div className="relative flex items-center">
            <select
              className="block w-full appearance-none rounded-md border border-gray-300 
                 bg-white p-2 sm:py-3 sm:px-4 pr-8 text-[.7rem] sm:text-base 
                 text-gray-700 focus:border-violet-500 focus:ring-2 
                 focus:ring-violet-400 transition-all duration-200 outline-none"
              {...register("eventStatus")}
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>

            <ChevronDown className="absolute right-3 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
          </div>

          {errors?.eventStatus && (
          <span className="text-red-500 text-[.5rem] sm:text-sm">
            {errors.eventStatus.message}
          </span>
        )}
        </div>
      </div>

      {/* <div className="bg-violet-50 border border-violet-400 rounded-lg p-6 mt-6">
        <h3 className="font-semibold mb-3">Event Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Event:</span>
            <span className="font-medium">{eventTitle}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Sport:</span>
            <span className="font-medium">{sportType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Match Time:</span>
            <span className="font-medium">{matchDate}</span>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default PublishAndPreview;
