import React, { useEffect, useState } from "react";
import {
  Building2,
  MapPin,
  Banknote,
  User,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";
import AdminSidebar from "../../sharedCompents/Admin/AdminSidebar";
import AdminNavbar from "../../sharedCompents/Admin/AdminNavbar";
import { useParams } from "react-router-dom";
import {
    approveOrganizerRequest,
  getOrganizerDetails,
  rejectOrganizerRequest
} from "../../services/admin";
import toast from "react-hot-toast";

const OrganizerDetailsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams();
  const [organizer, setOrganizer] = useState(null);
  const [loading, setLoading] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const fetchOrganizer = async () => {
    try {
      setLoading(true);
      const { data } = await getOrganizerDetails(id);
      if (data.success) setOrganizer(data.organizer);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch organizer details");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await approveOrganizerRequest(id);
      toast.success("Organizer approved successfully");
      fetchOrganizer();
    } catch (err) {
      toast.error("Failed to approve organizer");
    }
  };

  const handleReject = async () => {
    try {
      await rejectOrganizerRequest(id);
      toast.success("Organizer rejected successfully");
      fetchOrganizer();
    } catch (err) {
      toast.error("Failed to reject organizer");
    }
  };

  useEffect(() => {
    fetchOrganizer();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!organizer) return <p className="p-6">Organizer not found</p>;

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <AdminNavbar setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Organizer Details
              </h1>
              <p className="text-gray-500 text-sm">
                Review and manage organizer account requests.
              </p>
            </div>

            {/* Action Buttons */}
            {organizer.status === 'pending' && <div className="flex gap-3 mt-4 sm:mt-0">
              <button
                onClick={handleApprove}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                <CheckCircle className="w-5 h-5" />
                Approve
              </button>
              <button
                onClick={handleReject}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                <XCircle className="w-5 h-5" />
                Reject
              </button>
            </div>}
          </div>

          {/* Organizer Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Organization Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-6 h-6 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Organization Details
                </h2>
              </div>
              <div className="space-y-3 text-gray-700 text-sm">
                <p>
                  <strong>Name:</strong> {organizer.organizationDetails?.name}
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  {organizer.organizationDetails?.address}
                </p>
                <p>
                  <strong>State:</strong> {organizer.organizationDetails?.state}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      organizer.status
                    )}`}
                  >
                    {organizer.status}
                  </span>
                </p>
              </div>
            </div>

            {/* Bank Account Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Banknote className="w-6 h-6 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Bank Account Details
                </h2>
              </div>
              <div className="space-y-3 text-gray-700 text-sm">
                <p>
                  <strong>Beneficiary:</strong>{" "}
                  {organizer.bankAccountDetails?.beneficiaryName}
                </p>
                <p>
                  <strong>Bank Name:</strong>{" "}
                  {organizer.bankAccountDetails?.bankName}
                </p>
                <p>
                  <strong>Account Number:</strong>{" "}
                  {organizer.bankAccountDetails?.accountNumber}
                </p>
                <p>
                  <strong>Account Type:</strong>{" "}
                  {organizer.bankAccountDetails?.accountType}
                </p>
                <p>
                  <strong>IFSC:</strong> {organizer.bankAccountDetails?.ifsc}
                </p>
                <p>
                  <strong>Verified:</strong>{" "}
                  {organizer.bankAccountDetails?.isVerified ? (
                    <span className="text-green-600 font-semibold">Yes</span>
                  ) : (
                    <span className="text-red-600 font-semibold">No</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Created & Updated Info */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                Timestamps
              </h2>
            </div>
            <p className="text-sm text-gray-700">
              <strong>Created At:</strong>{" "}
              {new Date(organizer.createdAt).toLocaleString()}
            </p>
            <p className="text-sm text-gray-700 mt-2">
              <strong>Last Updated:</strong>{" "}
              {new Date(organizer.updatedAt).toLocaleString()}
            </p>
          </div>

          {/* Linked User Info */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                User Linked to this Organizer
              </h2>
            </div>
            <p className="text-gray-700 text-sm">
              <strong>User ID:</strong> {organizer.userId}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrganizerDetailsPage;
