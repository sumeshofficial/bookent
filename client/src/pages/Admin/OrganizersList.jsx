import { useEffect, useState } from "react";
import {
  Search,
  ChevronDown,
  Eye,
  Check,
  X,
  Loader,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import AdminSidebar from "../../sharedCompents/Admin/AdminSidebar.jsx";
import AdminNavbar from "../../sharedCompents/Admin/AdminNavbar.jsx";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrganizers } from "../../Redux/organizersSlice.js";
import {
  approveOrganizerRequest,
  rejectOrganizerRequest,
} from "../../services/admin.js";
import { Link } from "react-router-dom";

const OrganizersList = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  const dispatch = useDispatch();
  const { organizers, loading, totalPages } = useSelector(
    (state) => state.organizers
  );

  useEffect(() => {
    dispatch(
      fetchOrganizers({
        page: currentPage,
        limit,
        search: searchQuery,
        sort: sortOrder,
        status: statusFilter,
      })
    );
  }, [dispatch, currentPage, sortOrder, statusFilter, searchQuery]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleApprove = async (id) => {
    await approveOrganizerRequest(id);
    toast.success("Organizer approved!");
    dispatch(
      fetchOrganizers({
        page: currentPage,
        limit,
        search: searchQuery,
        sort: sortOrder,
        status: statusFilter,
      })
    );
  };

  const handleReject = async (id) => {
    await rejectOrganizerRequest(id);
    toast.error("Organizer rejected!");
    dispatch(
      fetchOrganizers({
        page: currentPage,
        limit,
        search: searchQuery,
        sort: sortOrder,
        status: statusFilter,
      })
    );
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">
        <AdminNavbar setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-4 md:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
            <h1 className="text-3xl font-semibold text-gray-900">
              Organizer List
            </h1>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Search */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search organizers..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm
                   focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white hover:border-blue-300 transition-all"
                />
              </div>

              {/* Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="appearance-none w-full sm:w-40 bg-white border border-gray-300 text-gray-700 text-sm rounded-xl
                   px-4 py-2.5 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <ChevronDown className="absolute right-3 top-3.5 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="appearance-none w-full sm:w-44 bg-white border border-gray-300 text-gray-700 text-sm rounded-xl
                   px-4 py-2.5 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="a-z">A–Z</option>
                  <option value="z-a">Z–A</option>
                </select>
                <ArrowUpDown className="absolute right-3 top-3.5 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100">
            <table className="min-w-[900px] w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    "Organization",
                    "State",
                    "Beneficiary",
                    "Bank",
                    "Status",
                    "Verified",
                    "Action",
                    "View",
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8">
                      <Loader className="w-6 h-6 animate-spin mx-auto text-blue-500" />
                    </td>
                  </tr>
                ) : organizers.length > 0 ? (
                  organizers.map((org) => (
                    <tr
                      key={org._id}
                      className="hover:bg-gray-50 transition-all"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {org.organizationDetails.name}
                        <div className="text-xs text-gray-400 mt-1">
                          {org.organizationDetails.address}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {org.organizationDetails.state}
                      </td>
                      <td className="px-6 py-4">
                        {org.bankAccountDetails.beneficiaryName}
                      </td>
                      <td className="px-6 py-4">
                        {org.bankAccountDetails.bankName}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            org.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : org.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {org.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-medium ${
                            org.isVerified ? "text-green-600" : "text-gray-400"
                          }`}
                        >
                          {org.isVerified ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {org.status === "pending" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(org._id)}
                              className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-600"
                            >
                              <Check size={14} /> Approve
                            </button>
                            <button
                              onClick={() => handleReject(org._id)}
                              className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600"
                            >
                              <X size={14} /> Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-sm">
                            No action
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Link to={`/admin/organizers/${org._id}`} className="p-2 hover:bg-gray-100 rounded-lg transition">
                          <Eye className="w-5 h-5 text-gray-600" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-gray-500">
                      No organizers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 px-2 gap-3 text-sm">
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600 disabled:text-gray-300"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>

                <div className="text-sm text-gray-700 mx-2">
                  Page <span className="font-semibold">{currentPage}</span> of{" "}
                  <span className="font-semibold">{totalPages}</span>
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600 disabled:text-gray-300"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-2 flex-wrap mt-2 sm:mt-0">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`px-3 py-1 rounded-lg ${
                        p === currentPage
                          ? "bg-gray-900 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default OrganizersList;
