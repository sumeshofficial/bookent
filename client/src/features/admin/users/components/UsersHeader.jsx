import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import {
  SORT_OPTIONS,
  STATUS_FILTERS,
} from "../constants/users.constants";

const UsersHeader = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "newest";
  const status = searchParams.get("status") || "all";

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.set("page", "1");
    setSearchParams(params);
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
        Users List
      </h1>

      <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => updateParam("search", e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border"
          />
        </div>

        <div className="relative w-full md:w-44">
          <select
            value={sort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="w-full rounded-xl border px-4 py-2.5 pr-8"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full md:w-40">
          <select
            value={status}
            onChange={(e) => updateParam("status", e.target.value)}
            className="w-full rounded-xl border px-4 py-2.5 pr-8"
          >
            {STATUS_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default UsersHeader;