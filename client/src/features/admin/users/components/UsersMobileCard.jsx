import PropTypes from "prop-types";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useModal } from "../../../../utils/constants";

const UsersMobileCard = ({ user, onToggle }) => {
  const { openModal, closeModal } = useModal();
  const isActive = user.status === "active";

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between">
        <div>
          <p className="font-medium">{user.fullname}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        <Link to={`/admin/users/${user._id}`}>
          <Eye className="w-5 h-5" />
        </Link>
      </div>

      <div className="mt-3 text-sm">
        <p>Wallet: $ {user.wallet}</p>
        <p>Status: {user.status}</p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {isActive ? "Active" : "Blocked"}
        </span>

        <button
          onClick={() =>
            openModal("user-status-confirmation", {
              onClose: closeModal,
              user,
              onConfirm: () => onToggle(user._id, user.status),
            })
          }
          className={`px-2 py-2 rounded-lg text-xs font-medium transition-colors ${
            isActive
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {isActive ? "Block" : "Activate"}
        </button>
      </div>
    </div>
  );
};

UsersMobileCard.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    fullname: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    wallet: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default UsersMobileCard;
