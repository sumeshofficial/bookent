import { Eye } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const UserRow = React.memo(({ user, handleToggleStatus }) => {
  return (
    <tr className="fade-in hover:bg-gray-50 transition-all duration-300">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
            {user.fullname.charAt(0)}
          </div>
          <div className="text-sm md:text-base">
            <p className="font-medium text-gray-900">{user.fullname}</p>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-gray-700">{user.totalBookings}</td>
      <td className="px-4 py-3 text-gray-700">₹ {user.spending.toFixed(2)}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-block w-20 text-center px-2 py-1 rounded-full text-xs md:text-sm font-medium ${
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
          onClick={() => handleToggleStatus(user._id, user.status)}
          className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            user.status === "blocked"
              ? "bg-red-500 focus:ring-red-500"
              : "bg-gray-300 focus:ring-gray-400"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
              user.status === "blocked" ? "translate-x-8" : "translate-x-1"
            }`}
          />
        </button>
      </td>
      <td className="px-4 py-3">
        <Link
          to={`/admin/users/${user._id}`}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Eye className="w-5 h-5 text-gray-600" />
        </Link>
      </td>
    </tr>
  );
});

export default UserRow;
