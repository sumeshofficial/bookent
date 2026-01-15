import {
  Building2,
  Banknote,
  User,
  Calendar,
  Loader,
  ArrowLeft,
  ChevronDown,
  Save,
  Check,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getOrganizerDetails,
  handleOrganizerRequest,
} from "../../services/admin";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useModal } from "../../utils/constants";

const OrganizerDetailsPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["organizer", id],
    queryFn: () => getOrganizerDetails(id),
  });
  const organizer = data;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(
    () => organizer?.status || ""
  );
  const { openModal, closeModal } = useModal();

  const navigate = useNavigate();

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

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleRequestMutation = useMutation({
    mutationFn: handleOrganizerRequest,
    onSuccess: () => {
      toast.dismiss();
      toast.success("Organizer request updated successfully");
      queryClient.setQueryData(["organizer", id], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          status: handleRequestMutation.variables.status,
        };
      });
    },
    onError: (err) => {
      toast.dismiss();
      toast.error(err.message || "Something went wrong");
    },
  });

  const handleRequest = (id, status, reason) => {
    handleRequestMutation.mutate({ id, status, reason });
  };

  return (
    <main key={id} className="flex-1 p-6 lg:p-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-800 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Organizers</span>
      </button>

      {isLoading && (
        <div className="flex justify-center items-center h-96">
          <Loader className="w-8 h-8 animate-spin text-gray-600" />
          <span className="ml-2 text-gray-600">
            Loading organizer details...
          </span>
        </div>
      )}

      {!isLoading && !organizer && (
        <div className="flex justify-center items-center h-96">
          <p className="text-gray-600">Organizer not found.</p>
        </div>
      )}

      {!isLoading && organizer && (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Organizer Details
              </h1>
              <p className="text-gray-500 text-sm">
                Review and manage organizer account requests.
              </p>
            </div>

            {organizer.status === "pending" && (
              <div className="relative">
                <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 bg-white">
                  <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-2 text-sm hover:bg-gray-100 px-2 py-1 rounded transition"
                  >
                    <span className="capitalize">
                      {selectedStatus || organizer.status}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </button>

                  {selectedStatus !== organizer.status && (
                    <button
                      onClick={() =>
                        openModal("confirmation", {
                          closeModal,
                          handleAction: handleRequest,
                          status: selectedStatus,
                          id,
                        })
                      }
                      className="flex items-center p-1 hover:bg-gray-100 rounded"
                      title="Save changes"
                    >
                      <Save className="w-5 h-5 text-violet-600" />
                    </button>
                  )}

                  {dropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                      <ul className="py-1">
                        <li
                          className="flex items-center gap-2 px-4 py-2 hover:bg-green-50 cursor-pointer"
                          onClick={() => {
                            setSelectedStatus("approved");
                            setDropdownOpen(false);
                          }}
                        >
                          <Check className="w-4 h-4 text-green-600" />
                          Approved
                        </li>

                        <li
                          className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 cursor-pointer"
                          onClick={() => {
                            setSelectedStatus("rejected");
                            setDropdownOpen(false);
                          }}
                        >
                          <X className="w-4 h-4 text-red-600" />
                          Rejected
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  {organizer.isVerified ? (
                    <span className="text-green-600 font-semibold">Yes</span>
                  ) : (
                    <span className="text-red-600 font-semibold">No</span>
                  )}
                </p>
              </div>
            </div>
          </div>

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

          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                Linked User
              </h2>
            </div>
            <p className="text-gray-700 text-sm">
              <strong>User ID:</strong> {organizer.userId}
            </p>
          </div>
        </>
      )}
    </main>
  );
};

export default OrganizerDetailsPage;
