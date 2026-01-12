import { X } from "lucide-react";

const FilterContent = ({
  dateFilters,
  categoryFilters,
  priceFilters,
  toggleFilter,
  isFilterSelected,
}) => (
  <div className="bg-white rounded-2xl shadow p-6 pb-14">
    <h2 className="text-lg font-bold text-gray-900 mb-8">Filters</h2>

    <div className="mb-8">
      <h3 className="text-sm font-bold text-gray-900 mb-4">Date</h3>
      <div className="grid grid-cols-2 gap-3">
        {dateFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => toggleFilter(filter, "date")}
            className={`px-1 py-2 rounded-sm border text-xs transition-all flex items-center justify-center ${
              isFilterSelected(filter, "date")
                ? "border-blue-500 text-gray-900 bg-white"
                : "border-gray-300 text-gray-600 hover:border-gray-400"
            }`}
          >
            {filter}
            {isFilterSelected(filter, "date") && (
              <X size={14} className="ml-1" />
            )}
          </button>
        ))}
      </div>
    </div>

    <div className="mb-8">
      <h3 className="text-sm font-bold text-gray-900 mb-4">Category</h3>
      <div className="grid grid-cols-2 gap-3">
        {categoryFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => toggleFilter(filter, "category")}
            className={`px-1 py-2 rounded-sm border text-xs transition-all ${
              isFilterSelected(filter, "category")
                ? "border-blue-500 text-gray-900 bg-white"
                : "border-gray-300 text-gray-600 hover:border-gray-400"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>

    <div>
      <h3 className="text-sm font-bold text-gray-900 mb-4">Price</h3>
      <div className="grid grid-cols-2 gap-3">
        {priceFilters.map((filter) => (
          <button
            key={filter}
            onClick={() => toggleFilter(filter, "price")}
            className={`px-1 py-2 rounded-sm border text-xs transition-all ${
              isFilterSelected(filter, "price")
                ? "border-blue-500 text-gray-900 bg-white"
                : "border-gray-300 text-gray-600 hover:border-gray-400"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default FilterContent;
