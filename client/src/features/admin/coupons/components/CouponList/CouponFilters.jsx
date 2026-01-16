import PropTypes from "prop-types";
import {
  DATE_FILTERS,
  SORT_OPTIONS,
  STATUS_FILTERS,
  TYPE_FILTERS,
} from "../../constants/coupon.constants";

const CouponFilters = ({ filters, setFilters }) => {
  const { search, status, type, date, sort, from, to } = filters;
  const { setSearch, setStatus, setType, setDate, setSort, setFrom, setTo } =
    setFilters;

  return (
    <div className="grid grid-cols-1 gap-3 p-3 border-b bg-white sm:grid-cols-2 lg:grid-cols-4">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search coupon..."
        className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
      />

      {[STATUS_FILTERS, TYPE_FILTERS, DATE_FILTERS, SORT_OPTIONS].map(
        (list, i) => (
          <select
            key={i}
            value={[status, type, date, sort][i]}
            onChange={(e) =>
              [setStatus, setType, setDate, setSort][i](e.target.value)
            }
            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            {list.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        )
      )}

      <input
        type="date"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
      />
      <input
        type="date"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
      />

      <button
        onClick={() => {
          setSearch("");
          setStatus("ALL");
          setType("ALL");
          setDate("ALL");
          setSort("NEWEST");
          setFrom("");
          setTo("");
        }}
        className="w-full sm:w-auto px-3 py-2 border rounded-md text-sm hover:bg-gray-100"
      >
        Clear
      </button>
    </div>
  );
};

CouponFilters.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    sort: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
  }).isRequired,
  setFilters: PropTypes.shape({
    setSearch: PropTypes.func.isRequired,
    setStatus: PropTypes.func.isRequired,
    setType: PropTypes.func.isRequired,
    setDate: PropTypes.func.isRequired,
    setSort: PropTypes.func.isRequired,
    setFrom: PropTypes.func.isRequired,
    setTo: PropTypes.func.isRequired,
  }).isRequired,
};

export default CouponFilters;
