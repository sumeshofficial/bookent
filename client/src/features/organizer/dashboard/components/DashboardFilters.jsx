import { useSearchParams } from "react-router-dom";

const DashboardFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const preset = searchParams.get("preset") || "year";
  const year = searchParams.get("year") || new Date().getFullYear();
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");

  const updatePreset = (value) => {
    searchParams.set("preset", value);

    if (value !== "custom") {
      searchParams.delete("fromDate");
      searchParams.delete("toDate");
    }

    setSearchParams(searchParams);
  };

  const updateYear = (value) => {
    searchParams.set("year", value);
    setSearchParams(searchParams);
  };

  const updateMonth = (key, value) => {
    searchParams.set(key, value);
    setSearchParams(searchParams);
  };

  return (
    <div className="flex gap-4 items-center">
      <select
        value={preset}
        onChange={(e) => updatePreset(e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="day">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="year">This Year</option>
        <option value="custom">Custom</option>
      </select>

      {preset === "custom" && (
        <div className="space-x-3">
          <input
            type="date"
            value={fromDate || ""}
            onChange={(e) => updateMonth("fromDate", e.target.value)}
          />
          <input
            type="date"
            value={toDate || ""}
            onChange={(e) => updateMonth("toDate", e.target.value)}
          />
        </div>
      )}

      {preset === "year" && (
        <select
          value={year}
          onChange={(e) => updateYear(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>
      )}
    </div>
  );
};

export default DashboardFilters;
