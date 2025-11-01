import { useCallback, useEffect, useState } from "react";
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
import toast from "react-hot-toast";
import {
  getAllOrganizers,
  handleOrganizerRequest,
} from "../../services/admin.js";
import { Link } from "react-router-dom";
import OrganizerRow from "./OrganizerRow.jsx";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const OrganizersList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("newest");
  const [debounceSearch, setDebouncedSearch] = useState("");
  const limit = 5;
  const [page, setPage] = useState(1);

  const queryClient = useQueryClient();

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);

    return () => clearTimeout(delay);
  }, [searchQuery]);

  const { data, isLoading } = useQuery({
    queryKey: ["organizers", page, limit, debounceSearch, sort, statusFilter],
    queryFn: () =>
      getAllOrganizers({
        page,
        limit,
        search: debounceSearch,
        sort,
        status: statusFilter,
      }),
    keepPreviousData: true,
    onError: (error) => toast.error(error.message)
  });

  const organizers = data?.data?.organizers || [];
  const totalPages = data?.data?.totalPages || 1;

  const handlePrev = useCallback(() => setPage(Math.max(page - 1, 1)), [page]);
  const handleNext = useCallback(
    () => setPage(Math.min(page + 1, totalPages)),
    [page, totalPages]
  );
  const handlePageClick = useCallback((num) => {
    setPage(num);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleRequestMutation = useMutation({
    mutationFn: handleOrganizerRequest,
    onSuccess: () => {
      toast.dismiss();
      toast.success("Organizer request updated");
      queryClient.invalidateQueries(["organizers"]);
    },
    onError: (err) => {
      toast.dismiss();
      toast.error(err.message || "Something went wrong");
    },
  });

  const handleRequest = useCallback(
    ({ id, status }) => {
      handleRequestMutation.mutate({ id, status });
    },
    [handleRequestMutation]
  );

  return (
    <main className="flex-1 p-4 md:p-8 pt-10 sm:pt-25">
      <div className="flex flex-col sm:flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-semibold text-gray-900">Organizer List</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
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

          <div className="flex flex-col">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Sort By
            </label>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
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

          <div className="flex flex-col">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Filter
            </label>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
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
          </div>
        </div>
      </div>

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
            {isLoading ? (
              <tr>
                <td colSpan={8} className="text-center py-8">
                  <Loader className="w-6 h-6 animate-spin mx-auto text-blue-500" />
                </td>
              </tr>
            ) : organizers.length > 0 ? (
              organizers.map((org) => (
                <OrganizerRow
                  key={org._id}
                  org={org}
                  handleRequest={handleRequest}
                />
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

      <div className="block md:hidden space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        ) : organizers.length > 0 ? (
          organizers.map((org) => (
            <div
              key={org._id}
              className="bg-white rounded-xl shadow p-4 border border-gray-100"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {org.organizationDetails.name}
              </h3>
              <p className="text-gray-500 text-sm">
                {org.organizationDetails.address}
              </p>

              <div className="mt-3 text-sm text-gray-700 space-y-1">
                <p>
                  <strong>State:</strong> {org.organizationDetails.state}
                </p>
                <p>
                  <strong>Beneficiary:</strong>{" "}
                  {org.bankAccountDetails.beneficiaryName}
                </p>
                <p>
                  <strong>Bank:</strong> {org.bankAccountDetails.bankName}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
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
                </p>
                <p>
                  <strong>Verified:</strong> {org.isVerified ? " Yes" : " No"}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                {org.status === "pending" ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleRequest({ id: org._id, status: "approved" })
                      }
                      className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-600"
                    >
                      <Check size={14} /> Approve
                    </button>
                    <button
                      onClick={() =>
                        handleRequest({ id: org._id, status: "rejected" })
                      }
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

                <Link
                  to={`/admin/organizers/${org._id}`}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <Eye className="w-5 h-5 text-gray-600" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-6">No organizers found</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-2">
          <span className="text-xs md:text-sm text-gray-600">
            Showing {(page - 1) * limit + 1}-
            {Math.min(page * limit, organizers.length)} of {organizers.length}
          </span>
          <div className="flex items-center gap-1 md:gap-2 flex-wrap">
            <button
              onClick={handlePrev}
              disabled={page === 1}
              className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => handlePageClick(num)}
                className={`px-3 py-1 rounded-lg ${
                  num === page ? "bg-gray-900 text-white" : "hover:bg-gray-100"
                }`}
              >
                {num}
              </button>
            ))}

            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default OrganizersList;
