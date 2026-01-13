import { useFilterParams } from "../../hooks/useFilterParams";
import DateFilter from "./DateFilter";
import SearchFilter from "./SearchFilter";
import SeatFilter from "./SeatFilter";
import SortFilter from "./SortFilter";

const BookingsFilter = ({ seatCategories }) => {
  const { fromDate, toDate, seatCategory, search, sortBy, updateParam } =
    useFilterParams();

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6 grid gap-4 grid-cols-1 md:grid-cols-5">
      <DateFilter
        label="From"
        value={fromDate}
        onChange={(v) => updateParam("from", v)}
      />

      <DateFilter
        label="To"
        value={toDate}
        onChange={(v) => updateParam("to", v)}
      />

      <SeatFilter
        seatCategories={seatCategories}
        value={seatCategory}
        onChange={(v) => updateParam("seatCategory", v)}
      />

      <SearchFilter value={search} onChange={(v) => updateParam("search", v)} />

      <SortFilter value={sortBy} onChange={(v) => updateParam("sort", v)} />
    </div>
  );
};

export default BookingsFilter;
