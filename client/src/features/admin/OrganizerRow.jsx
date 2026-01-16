import React from "react";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const OrganizerRow = React.memo(({ org }) => {
  return (
    <tr
      key={org._id}
      className="fade-in hover:bg-gray-50 transition-all duration-300"
    >
      <td className="px-6 py-4 font-medium text-gray-900">
        {org.organizationDetails.name}
        <div className="text-xs text-gray-400 mt-1">
          {org.organizationDetails.address}
        </div>
      </td>
      <td className="px-6 py-4">{org.organizationDetails.state}</td>
      <td className="px-6 py-4">{org.bankAccountDetails.beneficiaryName}</td>
      <td className="px-6 py-4">{org.bankAccountDetails.bankName}</td>
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
        <Link
          to={`/admin/organizers/${org._id}`}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <Eye className="w-5 h-5 text-gray-600" />
        </Link>
      </td>
    </tr>
  );
});

OrganizerRow.propTypes = {
  org: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    isVerified: PropTypes.bool.isRequired,
    organizationDetails: PropTypes.shape({
      name: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
    }).isRequired,
    bankAccountDetails: PropTypes.shape({
      beneficiaryName: PropTypes.string.isRequired,
      bankName: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default OrganizerRow;
