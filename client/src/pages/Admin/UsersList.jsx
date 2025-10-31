import { useEffect, useState } from "react";
import {
  Search,
  Menu,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader,
  ChevronDown,
} from "lucide-react";
import AdminSidebar from "../../sharedCompents/Admin/AdminSidebar";
import AdminNavbar from "../../sharedCompents/Admin/AdminNavbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, setPage } from "../../redux/usersSlice.js";
import toast from "react-hot-toast";
import { toggleUserStatusAPI } from "../../services/admin.js";
import { Link } from "react-router-dom";

const UsersList = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [statusFilter, setStatusFilter] = useState("all");

  const dispatch = useDispatch();
  const { users, page, totalPages, loading, error } = useSelector(
    (store) => store.users
  );
  const limit = 5;

  useEffect(() => {
    setPage(1);
    const delay = setTimeout(() => {
      dispatch(
        fetchUsers({
          page: 1,
          limit,
          search: searchQuery,
          sort,
          status: statusFilter,
        })
      );
    }, 400);

    return () => clearTimeout(delay);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
    dispatch(
      fetchUsers({
        page,
        limit,
        search: searchQuery,
        sort,
        status: statusFilter,
      })
    );
  }, [page, sort, statusFilter]);

  useEffect(() => {
    if (error) {
      toast.dismiss();
      toast.error("Something went wrong");
    }
  }, [error]);

  const handlePrev = () => dispatch(setPage(Math.max(page - 1, 1)));
  const handleNext = () => dispatch(setPage(Math.min(page + 1, totalPages)));
  const handlePageClick = (num) => dispatch(setPage(num));

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "blocked" : "active";
      await toggleUserStatusAPI({ userId, newStatus });
      dispatch(
        fetchUsers({
          page,
          limit,
          search: searchQuery,
          sort,
          status: statusFilter,
        })
      );
      toast.dismiss();
      toast.success(`User ${newStatus}`);
    } catch (err) {
      toast.dismiss();
      toast.error(err.message || "Failed to update status");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <AdminNavbar setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-4 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2 md:mb-0">
              Users List
            </h1>
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-start md:items-end">
              {/* Search Input */}
              <div className="flex flex-col">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Search
                </label>
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    placeholder="Search users..."
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm md:text-base
                   focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm bg-white
                   hover:border-blue-300 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="flex flex-col">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Sort By
                </label>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="appearance-none w-44 bg-white border border-gray-300 text-gray-700 text-sm rounded-xl
                   px-4 py-2.5 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                   hover:border-blue-300 transition-all duration-200"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="highestSpend">Highest Spending</option>
                    <option value="lowestSpend">Lowest Spending</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              {/* Filter Dropdown */}
              <div className="flex flex-col">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Filter
                </label>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="appearance-none w-40 bg-white border border-gray-300 text-gray-700 text-sm rounded-xl
                   px-4 py-2.5 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500
                   hover:border-blue-300 transition-all duration-200"
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Table (desktop) */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-sm">
            <table className="min-w-[600px] w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm md:text-base font-medium text-gray-700">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-sm md:text-base font-medium text-gray-700">
                    Bookings
                  </th>
                  <th className="px-4 py-3 text-left text-sm md:text-base font-medium text-gray-700">
                    Spending
                  </th>
                  <th className="px-4 py-3 text-left text-sm md:text-base font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm md:text-base font-medium text-gray-700">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left text-sm md:text-base font-medium text-gray-700">
                    View
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 relative">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full" />
                            <div className="flex flex-col gap-2">
                              <div className="h-3 w-28 bg-gray-200 rounded"></div>
                              <div className="h-3 w-40 bg-gray-100 rounded"></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-3 w-10 bg-gray-200 rounded"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-3 w-16 bg-gray-200 rounded"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-6 w-14 bg-gray-200 rounded-full"></div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="h-5 w-5 bg-gray-200 rounded"></div>
                        </td>
                      </tr>
                    ))
                  : users.length > 0
                  ? users.map((user) => (
                      <tr
                        key={user._id}
                        className="fade-in hover:bg-gray-50 transition-all duration-300"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                              {user.fullname.charAt(0)}
                            </div>
                            <div className="text-sm md:text-base">
                              <p className="font-medium text-gray-900">
                                {user.fullname}
                              </p>
                              <p className="text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {user.totalBookings}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          ₹ {user.spending.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs md:text-sm font-medium ${
                              user.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() =>
                              handleToggleStatus(user._id, user.status)
                            }
                            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              user.status === "blocked"
                                ? "bg-red-500 focus:ring-red-500"
                                : "bg-gray-300 focus:ring-gray-400"
                            }`}
                          >
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
                                user.status === "blocked"
                                  ? "translate-x-8"
                                  : "translate-x-1"
                              }`}
                            />
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <Link to={`/admin/users/${user._id}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Eye className="w-5 h-5 text-gray-600" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  : !loading && (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-6 text-gray-500"
                        >
                          No users found
                        </td>
                      </tr>
                    )}
              </tbody>
            </table>
          </div>

          {/* Mobile card view */}
          <div className="md:hidden space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <Loader className="w-8 h-8 animate-spin mx-auto text-violet-600" />
              </div>
            ) : users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user._id}
                  className="bg-white p-4 rounded-lg shadow-sm"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                        {user.fullname.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.fullname}
                        </p>
                        <p className="text-gray-500 text-sm">{user.email}</p>
                      </div>
                    </div>
                    <Link to={`/admin/users/${user._id}`} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye className="w-5 h-5 text-gray-600" />
                    </Link>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-700 gap-2">
                    <span>Bookings: {user.totalBookings}</span>
                    <span>Spendings: ₹ {user.spending.toFixed(2)}</span>
                    <span
                      className={`inline-block self-start px-2 py-1 rounded-full font-medium ${
                        user.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </div>

                  <div className="mt-2">
                    <button
                      onClick={() => handleToggleStatus(user._id, user.status)}
                      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        user.status === "blocked"
                          ? "bg-red-500 focus:ring-red-500"
                          : "bg-gray-300 focus:ring-gray-400"
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
                          user.status === "blocked"
                            ? "translate-x-8"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                No users found
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-2">
            <span className="text-xs md:text-sm text-gray-600">
              Showing {(page - 1) * limit + 1}-
              {Math.min(page * limit, users.length)} of {users.length}
            </span>
            <div className="flex items-center gap-1 md:gap-2 flex-wrap">
              <button
                onClick={handlePrev}
                disabled={page === 1}
                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (num) => (
                  <button
                    key={num}
                    onClick={() => handlePageClick(num)}
                    className={`px-3 py-1 rounded-lg ${
                      num === page
                        ? "bg-gray-900 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {num}
                  </button>
                )
              )}

              <button
                onClick={handleNext}
                disabled={page === totalPages}
                className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UsersList;
