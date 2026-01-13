import { useSearchParams } from "react-router-dom";
import { DATE_PRESETS } from "../constants/sales.constants";

const SalesFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const preset = searchParams.get("preset") || "month";
  const fromDate = searchParams.get("fromDate") || "";
  const toDate = searchParams.get("toDate") || "";
  const sort = searchParams.get("sort") || "";

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);

    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    setSearchParams(params);
  };

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <select
        value={preset}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams);
          params.set("preset", e.target.value);
          if (e.target.value !== "custom") {
            params.delete("fromDate");
            params.delete("toDate");
          }
          setSearchParams(params);
        }}
        className="border px-3 py-2 rounded"
      >
        {DATE_PRESETS.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>

      {preset === "custom" && (
        <>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => updateParam("fromDate", e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => updateParam("toDate", e.target.value)}
            className="border px-3 py-2 rounded"
          />
        </>
      )}

      <select
        value={sort}
        onChange={(e) => {
          const value = e.target.value;
          const params = new URLSearchParams(searchParams);
          if (!value) {
            params.delete("sort");
          } else {
            params.set("sort", value);
          }
          setSearchParams(params);
        }}
        className="border px-3 py-2 rounded"
      >
        <option value="">Sort By</option>
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
        <option value="amount_high">Amount High</option>
        <option value="amount_low">Amount Low</option>
      </select>
    </div>
  );
};

export default SalesFilters;
