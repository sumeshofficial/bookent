import { useSearchParams } from "react-router-dom";
import {
  EVENT_STATUS,
  SORT_OPTIONS,
  PRICE_FILTERS,
} from "../constants/events.constants";

const EventsFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getParam = (key, defaultValue = "") =>
    searchParams.get(key) || defaultValue;

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);

    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    params.set("page", "1");
    setSearchParams(params);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-3 bg-white p-4 rounded-lg shadow">
      <input
        type="text"
        placeholder="Search events..."
        value={getParam("search")}
        onChange={(e) => updateParam("search", e.target.value)}
        className="border px-3 py-2 rounded-md col-span-2"
      />

      <select
        value={getParam("status", "All")}
        onChange={(e) => updateParam("status", e.target.value)}
        className="border px-3 py-2 rounded-md"
      >
        {EVENT_STATUS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        value={getParam("sort", "latest")}
        onChange={(e) => updateParam("sort", e.target.value)}
        className="border px-3 py-2 rounded-md"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <select
        value={getParam("priceFilter")}
        onChange={(e) => updateParam("priceFilter", e.target.value)}
        className="border px-3 py-2 rounded-md"
      >
        {PRICE_FILTERS.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={getParam("startDate")}
        onChange={(e) => updateParam("startDate", e.target.value)}
        className="border px-3 py-2 rounded-md"
      />

      <input
        type="date"
        value={getParam("endDate")}
        onChange={(e) => updateParam("endDate", e.target.value)}
        className="border px-3 py-2 rounded-md"
      />
    </div>
  );
};

export default EventsFilters;