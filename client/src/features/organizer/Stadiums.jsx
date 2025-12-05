import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { getStadiumsWithOrganizerId } from "../../services/organization";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

const Stadiums = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialSort = searchParams.get("sort") || "capacity-low";
  const initialPage = Number(searchParams.get("page")) || 1;

  const { organizer } = useSelector((store) => store.organizer);

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sort, setSort] = useState(initialSort);
  const [debouncedSearch] = useDebounce(searchQuery, 500);

  useEffect(() => {
    const params = {};
    if (searchQuery) params.search = searchQuery;
    if (sort) params.sort = sort;
    params.page = currentPage;
    setSearchParams(params);
  }, [searchQuery, sort, currentPage, setSearchParams]);

  const { data, isLoading } = useQuery({
    queryKey: ["stadiums", organizer._id, debouncedSearch, sort, currentPage],
    queryFn: () =>
      getStadiumsWithOrganizerId({
        id: organizer._id,
        page: currentPage,
        limit: 6,
        search: debouncedSearch,
        sort,
      }),
    enabled: !!organizer,
    retry: 1,
    onError: () => toast.error("Failed to load stadium"),
  });

  const stadiums = data?.stadiums || [];
  const pagination = data?.pagination || {};

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-1 sm:p-10">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
        Stadiums
      </h2>

      <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-4 gap-3 ">
          <div className="relative w-full lg:w-5/12">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setCurrentPage(1);
                setSearchQuery(e.target.value);
              }}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-full
                           text-sm focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div
            className="flex items-center 
                            gap-2 border border-gray-300 text-xs rounded-xl px-4 py-3 lg:rounded-full lg:px-4 lg:py-2 
                            w-full lg:w-auto lg:self-end"
          >
            <span className="font-semibold text-gray-700 text-sm">Sort</span>

            <button
              onClick={() => {
                setCurrentPage(1);
                setSort("capacity-high");
              }}
              className={`${
                sort === "capacity-high"
                  ? "font-semibold text-purple-600"
                  : "text-gray-700"
              }`}
            >
              Capacity ↓
            </button>

            <button
              onClick={() => {
                setCurrentPage(1);
                setSort("capacity-low");
              }}
              className={`${
                sort === "capacity-low"
                  ? "font-semibold text-purple-600"
                  : "text-gray-700"
              }`}
            >
              Capacity ↑
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white shadow-md rounded-lg border border-gray-200 animate-pulse overflow-hidden w-full h-[380px] flex flex-col"
            >
              <div className="w-full h-40 bg-gray-300"></div>

              <div className="p-4 flex flex-col justify-between h-[220px]">
                <div className="space-y-3">
                  <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>

                <div className="mt-4 w-full h-9 bg-gray-300 rounded-md"></div>
              </div>
            </div>
          ))
        ) : stadiums.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-500">
            <p className="text-xl font-semibold">No Stadiums Found</p>
            <p className="text-sm mt-2">Try changing the search or filters.</p>
          </div>
        ) : (
          stadiums.map((stadium) => (
            <div
              key={stadium._id}
              className="bg-white shadow-md rounded-lg border border-gray-200 hover:shadow-lg overflow-hidden
                   w-full h-[380px] flex flex-col transition-opacity duration-700 opacity-0 animate-[fadeIn_0.7s_ease-in-out_forwards]"
            >
              <div className="w-full h-40 bg-gray-100">
                <img
                  src={stadium?.layoutImage}
                  alt={stadium?.stadiumDetails?.stadiumName}
                  className="w-full h-full object-contain bg-gray-200"
                />
              </div>

              <div className="p-4 flex flex-col justify-between h-[220px]">
                <div className="overflow-hidden">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {stadium?.stadiumDetails?.stadiumName}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1 truncate">
                    {stadium?.stadiumDetails?.city},
                    {stadium?.stadiumDetails?.state}
                  </p>

                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">Capacity:</span>
                    {stadium?.stadiumDetails?.capacity}
                  </p>

                  <p className="text-sm text-gray-600 truncate">
                    <span className="font-medium">Address:</span>{" "}
                    {stadium?.stadiumDetails?.address}
                  </p>
                </div>

                <Link to={`/listmyshow/stadium/${stadium.slug}`}>
                  <button className="mt-4 w-full bg-violet-600 text-white py-2 rounded-md text-sm hover:bg-violet-700 transition">
                    View Stadium
                  </button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400"
                : "bg-white text-purple-600 hover:bg-purple-50"
            }`}
          >
            <ChevronLeft size={20} />
          </button>

          {[...Array(pagination.totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-semibold ${
                currentPage === index + 1
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700 hover:bg-purple-50"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === pagination.totalPages}
            className={`p-2 rounded-lg ${
              currentPage === pagination.totalPages
                ? "bg-gray-200 text-gray-400"
                : "bg-white text-purple-600 hover:bg-purple-50"
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Stadiums;
