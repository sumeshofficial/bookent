import {
  STATUS_OPTIONS,
  SORT_OPTIONS,
} from "../constants/banner.constants";

const BannerFilters = ({ updateParam }) => {
  return (
    <div className="flex gap-3 mb-4">
      <input
        placeholder="Search title / subtitle"
        className="border px-2 py-1"
        onChange={(e) => updateParam("search", e.target.value)}
      />

      <select
        className="border px-2 py-1"
        onChange={(e) => updateParam("isActive", e.target.value)}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        className="border px-2 py-1"
        onChange={(e) => updateParam("sort", e.target.value)}
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BannerFilters;