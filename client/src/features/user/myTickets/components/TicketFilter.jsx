import { useSearchParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const TicketFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "ALL";
  const sort = searchParams.get("sort") || "booked";

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);

    if (!value || value === "ALL") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    setSearchParams(params, { replace: true });
  };

  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between w-full max-w-full md:max-w-3xl lg:max-w-5xl mx-auto">
      <input
        type="text"
        placeholder="Search events or venue"
        value={search}
        onChange={(e) => updateParam("search", e.target.value)}
        className="w-full sm:w-56 lg:w-60 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
      />

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <div className="relative">
          <select
            value={status}
            onChange={(e) => updateParam("status", e.target.value)}
            className="appearance-none w-full sm:w-auto px-3 py-2 pr-8 border rounded-lg text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="ALL">All</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="ABANDONED">Abandoned</option>
            <option value="PENDING_PAYPAL_ORDER">Pending Paypal Order</option>
            <option value="REFUNDED">Refunded</option>
          </select>

          <ChevronDown
            size={16}
            className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
          />
        </div>

        <div className="relative">
          <select
            value={sort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="appearance-none w-full sm:w-auto px-3 py-2 pr-8 border rounded-lg text-sm bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="booked">Recently booked</option>
            <option value="booked_asc">Oldest booked</option>
            <option value="upcoming">Upcoming first</option>
            <option value="past">Past first</option>
            <option value="az">Event A–Z</option>
          </select>

          <ChevronDown
            size={16}
            className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
          />
        </div>
      </div>
    </div>
  );
};

export default TicketFilters;