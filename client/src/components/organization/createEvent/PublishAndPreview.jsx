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
              <option value="Postpone">Postpone</option>
              <option value="Comming-Soon">Comming Soon</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Completed">Completed</option>
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

      <div>
        {watch("eventStatus") === "Postpone" && (
          <div>
            <div className="mt-2 sm:mt-5 flex flex-col gap-2">
              <label className="text-[.7rem] sm:text-sm">New Match Date</label>
              <input
                type="Date"
                {...register("newMatchDate")}
                className="border text-[.7rem] sm:text-base border-gray-200 rounded-md py-1 px-2 sm:py-3 sm:px-3 placeholder:text-gray-400 placeholder:text-[.5rem] sm:placeholder:text-base focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="E.g. 12/12/2025"
              />
              {errors?.newMatchDate && (
                <span className="text-red-500 text-[.5rem] sm:text-sm">
                  {errors.newMatchDate.message}
                </span>
              )}
            </div>

            <div className="mt-2 sm:mt-5 flex flex-col gap-2">
              <label className="text-xs sm:text-sm">Postpone Reasone</label>
              <input
                type="text"
                placeholder="e.g., due to rain"
                {...register("postponeReasone")}
                className="border text-xs sm:text-base border-gray-200 rounded-md py-2 px-2 sm:py-3 sm:px-3 placeholder:text-gray-400 placeholder:text-xs sm:placeholder:text-base focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              {errors?.postponeReasone && (
                <span className="text-red-500 text-[.5rem] sm:text-sm">
                  {errors.postponeReasone.message}
                </span>
              )}
            </div>
          </div>
        )}
        {watch("eventStatus") === "Cancelled" && (
          <div>
            <div className="mt-2 sm:mt-5 flex flex-col gap-2">
              <label className="text-xs sm:text-sm">Cancelled Reasone</label>
              <input
                type="text"
                placeholder="e.g., due to rain"
                {...register("cancelledReasone")}
                className="border text-xs sm:text-base border-gray-200 rounded-md py-2 px-2 sm:py-3 sm:px-3 placeholder:text-gray-400 placeholder:text-xs sm:placeholder:text-base focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              {errors?.cancelledReasone && (
                <span className="text-red-500 text-[.5rem] sm:text-sm">
                  {errors.cancelledReasone.message}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-linear-to-br from-violet-50 to-violet-100 border border-violet-300 rounded-xl p-4 sm:p-6 mt-8 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4 sm:text-lg text-base">
          Event Summary
        </h3>

        <div className="space-y-4 sm:space-y-5">
          {[
            { label: "Event Title", value: watch("eventTitle") },
            { label: "Sport Type", value: watch("sportType") },
            {
              label: "Match Date & Time",
              value: watch("matchDate")
                ? new Date(watch("matchDate")).toLocaleString()
                : null,
            },
            { label: "Stadium Name", value: watch("stadiumName") },
            { label: "Full Address", value: watch("stadiumAddress") },
            {
              label: "Ticket Price Range",
              value:
                watch("minPrice") && watch("maxPrice")
                  ? `₹${watch("minPrice")} - ₹${watch("maxPrice")}`
                  : null,
            },
            { label: "Age Restriction", value: watch("ageRestriction") },
            {
              label: "Refund Available",
              value: watch("refund") ? "Yes" : "No",
            },
            {
              label: "Status",
              value: watch("eventStatus") || "Draft",
              color:
                watch("eventStatus") === "Published"
                  ? "text-green-600"
                  : "text-yellow-600",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm"
            >
              <p className="text-gray-500 text-xs sm:text-sm mb-1">
                {item.label}
              </p>
              <p
                className={`text-gray-900 font-medium text-sm sm:text-base wrap-break-word ${
                  item.color || ""
                }`}
              >
                {item.value || "---"}
              </p>
            </div>
          ))}

          <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm">
            <p className="text-gray-500 text-xs sm:text-sm mb-1">
              Terms & Conditions
            </p>
            <p className="text-gray-700 text-xs sm:text-sm max-h-32 overflow-y-auto wrap-break-word leading-relaxed">
              {watch("termsAndConditions")
                ? watch("termsAndConditions").slice(0, 200) + "..."
                : "---"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishAndPreview;
