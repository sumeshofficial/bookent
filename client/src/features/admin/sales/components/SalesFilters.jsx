import { useSearchParams } from "react-router-dom";
import { DATE_PRESETS } from "../constants/sales.constants";

const SalesFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const preset = searchParams.get("preset") || "month";
  const fromDate = searchParams.get("fromDate") || "";
  const toDate = searchParams.get("toDate") || "";

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
    </div>
  );
};

export default SalesFilters;