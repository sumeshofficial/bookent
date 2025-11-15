import { useState } from "react";
import {
  Search,
  Plus,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import EventsCard from "../../components/organization/showEvents/EventsCard";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../../services/organization";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const OrganizerEventsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showMenu, setShowMenu] = useState(null);

  // filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sort, setSort] = useState("latest");

  const [category, setCategory] = useState(""); // NEW
  const [priceFilter, setPriceFilter] = useState(""); // NEW

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { organizer } = useSelector((store) => store.organizer);
  const organizerId = organizer?._id;

  const { data, isLoading } = useQuery({
    queryKey: [
      "events",
      organizerId,
      searchQuery,
      statusFilter,
      sort,
      category,
      priceFilter,
      startDate,
      endDate,
      currentPage,
    ],
    queryFn: () =>
      getEvents({
        id: organizerId,
        page: currentPage,
        limit: 8,
        search: searchQuery,
        sort,
        status: statusFilter,
        category,
        priceFilter,
        startDate,
        endDate,
      }),
    enabled: !!organizerId,
    retry: 1,
    onError: () => toast.error("Failed to load events"),
  });

  const handleDelete = async (id) => {
    console.log(id)
  }

  const events = data?.events || [];
  const pagination = data?.pagination || {};

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getBookingPercentage = (booked, total) =>
    total ? ((booked / total) * 100).toFixed(1) : "0";

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              My Events
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage all your sports events
            </p>
          </div>

          <Link
            to={"/listmyshow/event/create"}
            className="flex items-center gap-2 px-2 py-2 sm:px-4 sm:py-3 bg-purple-600 text-sm text-white rounded-lg hover:bg-purple-700 transition font-semibold"
          >
            <Plus className="w-5 h-5" />
            Create Event
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4 gap-3">
            <div className="relative w-full lg:w-52">
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
              className="flex flex-col sm:flex-row lg:flex-row items-start sm:items-center 
                    gap-3 border border-gray-300 rounded-xl px-4 py-3 lg:rounded-full lg:px-4 lg:py-1.5
                    w-full lg:w-auto"
            >
              <span className="font-semibold text-gray-700 text-sm">
                Filter
              </span>

              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-sm text-gray-700 focus:outline-none cursor-pointer 
                    px-2 py-1 w-full sm:w-auto"
              >
                <option value="">All Categories</option>
                <option value="Cricket">Cricket</option>
                <option value="Football">Football</option>
                <option value="Basketball">Basketball</option>
              </select>

              <select
                value={priceFilter}
                onChange={(e) => {
                  setPriceFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-sm text-gray-700 focus:outline-none cursor-pointer 
                    px-2 py-1 w-full sm:w-auto"
              >
                <option value="">Price</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="text-xs bg-transparent 
                     focus:outline-none cursor-pointer w-full sm:w-auto"
                />

                <span className="text-gray-400">–</span>

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="text-xs bg-transparent
                     focus:outline-none cursor-pointer w-full sm:w-auto"
                />
              </div>
            </div>

            <div
              className="flex items-center 
                    gap-2 border border-gray-300 text-xs rounded-xl px-4 py-3 lg:rounded-full lg:px-4 lg:py-2 
                    w-full lg:w-auto"
            >
              <span className="font-semibold text-gray-700 text-sm">Sort</span>

              <button
                onClick={() => setSort("price-high")}
                className={`${
                  sort === "price-high"
                    ? "font-semibold text-purple-600"
                    : "text-gray-700"
                }`}
              >
                Price ↓
              </button>

              <button
                onClick={() => setSort("price-low")}
                className={`${
                  sort === "price-low"
                    ? "font-semibold text-purple-600"
                    : "text-gray-700"
                }`}
              >
                Price ↑
              </button>

              <button
                onClick={() => setSort("latest")}
                className={`${
                  sort === "latest"
                    ? "font-semibold text-purple-600"
                    : "text-gray-700"
                }`}
              >
                Latest
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="max-w-7xl mx-auto space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-lg shadow-lg p-6"
              >
                <div className="h-40 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <EventsCard
                key={event._id}
                event={event}
                formatDate={formatDate}
                handleDelete={handleDelete}
                getBookingPercentage={getBookingPercentage}
                formatCurrency={formatCurrency}
                setShowMenu={setShowMenu}
                showMenu={showMenu}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <Calendar className="text-gray-400 mb-4 mx-auto" size={48} />
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              No events found
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Try searching or adjust filters
            </p>

            <Link
              to={"/listmyshow/event/create"}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
            >
              Create Your First Event
            </Link>
          </div>
        )}

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
    </div>
  );
};

export default OrganizerEventsPage;
