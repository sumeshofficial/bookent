import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import debounce from "lodash.debounce";
import {
  STATUS_OPTIONS,
  SORT_OPTIONS,
} from "../constants/banner.constants";

const BannerFilters = ({ updateParam }) => {
  const [searchParams] = useSearchParams();

  const urlSearch = searchParams.get("search") || "";
  const isActive = searchParams.get("isActive") || "all";
  const sort = searchParams.get("sort") || "latest";

  const [search, setSearch] = useState(urlSearch);

  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  const debouncedUpdateSearch = useMemo(
    () =>
      debounce((value) => {
        updateParam("search", value);
      }, 400),
    [updateParam]
  );

  useEffect(() => {
    return () => debouncedUpdateSearch.cancel();
  }, [debouncedUpdateSearch]);

  return (
    <div className="flex gap-3 mb-4">
      <input
        placeholder="Search title / subtitle"
        className="border px-2 py-1"
        value={search}
        onChange={(e) => {
          const value = e.target.value;
          setSearch(value);
          debouncedUpdateSearch(value); 
        }}
      />

      <select
        className="border px-2 py-1"
        value={isActive}
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
        value={sort}
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