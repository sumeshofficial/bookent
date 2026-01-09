import { useSearchParams } from "react-router-dom";

const DashboardFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const preset = searchParams.get("preset") || "year";
  const year = searchParams.get("year") || new Date().getFullYear();

  const updatePreset = (value) => {
    searchParams.set("preset", value);
    setSearchParams(searchParams);
  };

  const updateYear = (value) => {
    searchParams.set("year", value);
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
      </select>

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