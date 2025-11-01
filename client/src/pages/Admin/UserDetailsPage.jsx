import {
  User,
  Mail,
  ShoppingCart,
  Wallet,
  Calendar,
  Filter,
  ChevronDown,
  Loader,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserDeatils } from "../../services/admin";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

const UserDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-cyan-100 text-cyan-700";
      case "Canceled":
      case "Refunded":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserDeatils(id),
    onError: (error) => toast.error(error.message)
  });

  const user = data?.data?.user;

  return (
    <main className="flex-1 p-1 lg:p-8">

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
          <span className="ml-2 text-gray-600">Loading user details...</span>
        </div>
      )}

      {!isLoading && !user && (
        <div className="flex justify-center items-center h-96">
          <p className="text-gray-600">User not found.</p>
        </div>
      )}

      {!isLoading && user && (
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              User Details
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-full h-32 bg-linear-to-r from-gray-700 to-gray-800 rounded-t-lg -mx-6 -mt-6 mb-16"></div>
                <div className="w-32 h-32 text-5xl rounded-full border-4 bg-gray-200 border-white -mt-28 flex items-center justify-center text-gray-600 font-medium">
                  {user.fullname?.charAt(0)}
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mt-3">
                  {user.fullname}
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Full Name</p>
                    <p className="text-sm font-medium text-gray-800">
                      {user.fullname}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-sm font-medium text-gray-800">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <ShoppingCart className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Latest Transaction
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {user?.transactions?.length > 0
                        ? new Date(
                            user.transactions[0].date
                          ).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="text-sm text-gray-500">Total Spending</h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    ₹ {user.spending?.toFixed(2)}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="text-sm text-gray-500">Total Bookings</h3>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {user?.totalBookings}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Transaction History
                  </h2>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-1 px-1 py-1 sm:gap-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                      <Calendar className="w-4 h-4" />
                      Select Date
                    </button>
                    <button className="flex items-center gap-1 px-1 py-1 sm:gap-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                      <Filter className="w-4 h-4" />
                      Filters
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-900 text-white">
                        <th className="text-left px-4 py-3 text-sm font-medium">
                          Order ID
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-medium">
                          Events
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-medium">
                          <div className="flex items-center gap-1">
                            Total
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-medium">
                          <div className="flex items-center gap-1">
                            Status
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-medium">
                          <div className="flex items-center gap-1">
                            Date
                            <ChevronDown className="w-4 h-4" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {user?.transactions?.length > 0 ? (
                        user.transactions.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4">
                              <span className="text-blue-600 font-medium text-sm">
                                {transaction.id}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded"></div>
                                <span className="text-sm text-gray-800">
                                  {transaction.event}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-800">
                              ₹{transaction.total.toFixed(2)}
                            </td>
                            <td className="px-4 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  transaction.status
                                )}`}
                              >
                                {transaction.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-600">
                              {new Date(transaction.date).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="5"
                            className="px-4 py-4 text-center text-gray-500"
                          >
                            No transactions found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default UserDetailsPage;
