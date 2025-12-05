import { useEffect, useState, useRef } from "react";
import EventCard from "../../components/home/EventCard";
import { X, SlidersHorizontal, ChevronDown } from "lucide-react";
import Navbar from "../../sharedComponents/user/navbar/Navbar";
import { getFilterAndSortEvent } from "../../services/user";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const category = searchParams.get("category") || "all";

  const dateParam = searchParams.get("date") || "";
  const selectedDateFilters = dateParam ? dateParam.split("-").join(" ") : "";
  const selectedCategoryFilters = searchParams.get("category") || "";
  const min = searchParams.get("min_price");
  const max = searchParams.get("max_price");
  const selectedPriceFilters = min && max ? `${min} - ${max}` : "";

  useEffect(() => {
    const legacy = searchParams.get("price");
    if (!legacy) return;

    const decoded = decodeURIComponent(legacy).replace(/\+/g, " ");
    const parts = decoded
      .split("-")
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length === 2) {
      const [lmin, lmax] = parts;
      const sp = new URLSearchParams(searchParams);
      sp.set("min_price", lmin);
      sp.set("max_price", lmax);
      sp.delete("price");
      sp.set("page", 1);
      setSearchParams(sp);
    }
  }, []);
  const sortOption = searchParams.get("sort") || "";

  const [results, setResults] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef(null);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const setPage = (val) => {
    const sp = new URLSearchParams(searchParams);
    sp.set("page", val);
    setSearchParams(sp);
  };

  // const { category } = useParams();
  const title = category.charAt(0).toUpperCase() + category.slice(1);

  const dateFilters = ["Today", "Tomorrow", "This Week", "This Month"];
  const categoryFilters = [
    "Football",
    "Cricket",
    "Running",
    "Chess",
    "Volleyball",
    "Kabaddi",
  ];
  const priceFilters = ["0 - 200", "300 - 500", "600 - 1000", "1200 - 5000"];

  const fetchEvents = async () => {
    const params = {
      page,
      homeCategory: category,
      sort: sortOption,
      date: selectedDateFilters.split(" ").join("-"),
      category: selectedCategoryFilters,
      price: selectedPriceFilters,
    };

    const data = await getFilterAndSortEvent(params);

    return {
      events: data?.events ?? [],
      hasMore: data?.events?.length === 20,
    };
  };

  const { data, isFetching } = useQuery({
    queryKey: ["events", searchParams.toString(), page],
    queryFn: fetchEvents,
    keepPreviousData: true,
  });

  useEffect(() => {
    setResults([]);
    if (page !== 1) {
      setPage(1);
    }
  }, [searchParams.toString()]);

  useEffect(() => {
    if (!data) return;
    if (page === 1) {
      setResults(data.events);
    } else {
      setResults((prev) => [...prev, ...data.events]);
    }
    setHasMore(data.hasMore);
  }, [data]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !isFetching) {
          setPage(page + 1);
        }
      },
      { threshold: 1 }
    );

    const current = loaderRef.current;
    if (current) observer.observe(current);
    return () => current && observer.unobserve(current);
  }, [hasMore, isFetching]);

  const toggleFilter = (filter, type) => {
    const sp = new URLSearchParams(searchParams);

    if (type === "price") {
      const [min, max] = filter.split(" - ").map((s) => s.trim());

      const currentMin = sp.get("min_price");
      const currentMax = sp.get("max_price");

      if (currentMin === min && currentMax === max) {
        sp.delete("min_price");
        sp.delete("max_price");
      } else {
        sp.set("min_price", min);
        sp.set("max_price", max);
      }

      if (sp.has("price")) sp.delete("price");

      sp.set("page", 1);
      setSearchParams(sp);
      return;
    }

    if (type === "date") {
      const current = sp.get("date") || "";
      const encoded = filter.split(" ").join("-");

      const value = current === encoded ? "" : encoded;

      if (value) sp.set("date", value);
      else sp.delete("date");

      sp.set("page", 1);
      setSearchParams(sp);
      return;
    }

    const current = sp.get(type) || "";
    const value = current === filter ? "" : filter;

    if (value) sp.set(type, value);
    else sp.delete(type);

    sp.set("page", 1);
    setSearchParams(sp);
  };

  const isFilterSelected = (filter, type) => {
    if (type === "date") return selectedDateFilters === filter;
    if (type === "category") return selectedCategoryFilters === filter;
    if (type === "price") {
      const [minF, maxF] = filter.split(" - ");

      return selectedPriceFilters === `${minF} - ${maxF}`;
    }
    return false;
  };

  const FilterContent = () => (
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

  return (
    <div className="min-h-screen bg-gray-200 pb-16">
      <Navbar />

      <div className="md:hidden sticky top-0 z-20 bg-gray-200 px-4 py-3 flex justify-between items-center">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="px-4 py-2 bg-gray-100 rounded-md text-sm font-medium"
        >
          Filters
        </button>

        <button
          onClick={() => setSortOpen(true)}
          className="px-4 py-2 bg-gray-100 rounded-md text-sm font-medium flex items-center gap-2"
        >
          <SlidersHorizontal size={16} />
          Sort
        </button>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="hidden md:block w-90 bg-gray-200 p-6 min-h-screen">
          <FilterContent />
        </div>

        <div className="flex-1 p-6 md:p-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-xl md:text-4xl font-bold text-gray-900">
              {title}
            </h1>

            <div className="relative hidden md:block">
              <select
                value={sortOption}
                onChange={(e) => {
                  const sp = new URLSearchParams(searchParams);
                  sp.set("sort", e.target.value);
                  sp.set("page", 1);
                  setSearchParams(sp);
                }}
                className="appearance-none border px-3 py-2 pr-10 rounded-lg text-sm bg-white w-full cursor-pointer"
              >
                <option value="" disabled>
                  Sort
                </option>
                <option value="popular">Popularity</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
                <option value="latest">Latest</option>
              </select>

              <ChevronDown
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
            {results?.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </div>
      </div>

      {mobileFilterOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileFilterOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto animate-slideUp"
          >
            <div className="flex justify-between mb-6">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={() => setMobileFilterOpen(false)}>
                <X size={22} />
              </button>
            </div>
            <FilterContent />
          </div>
        </div>
      )}

      {sortOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setSortOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 animate-slideUp"
          >
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">Sort By</h2>
              <button onClick={() => setSortOpen(false)}>
                <X size={22} />
              </button>
            </div>

            <div className="space-y-3 text-gray-800">
              <button
                className="block w-full text-left py-2"
                onClick={() => {
                  const sp = new URLSearchParams(searchParams);
                  sp.set("sort", "popular");
                  sp.set("page", 1);
                  setSearchParams(sp);
                  setSortOpen(false);
                }}
              >
                Popularity
              </button>

              <button
                className="block w-full text-left py-2"
                onClick={() => {
                  const sp = new URLSearchParams(searchParams);
                  sp.set("sort", "low-high");
                  sp.set("page", 1);
                  setSearchParams(sp);
                  setSortOpen(false);
                }}
              >
                Price: Low to High
              </button>

              <button
                className="block w-full text-left py-2"
                onClick={() => {
                  const sp = new URLSearchParams(searchParams);
                  sp.set("sort", "high-low");
                  sp.set("page", 1);
                  setSearchParams(sp);
                  setSortOpen(false);
                }}
              >
                Price: High to Low
              </button>

              <button
                className="block w-full text-left py-2"
                onClick={() => {
                  const sp = new URLSearchParams(searchParams);
                  sp.set("sort", "latest");
                  sp.set("page", 1);
                  setSearchParams(sp);
                  setSortOpen(false);
                }}
              >
                Latest
              </button>
            </div>
          </div>
        </div>
      )}

      {hasMore && (
        <div ref={loaderRef} className="h-10 flex justify-center items-center">
          {isFetching && (
            <p className="text-gray-500 text-sm">Loading more...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
