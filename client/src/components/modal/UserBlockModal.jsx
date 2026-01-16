import PropTypes from "prop-types";

const UserBlockModal = ({ onClose, user, onConfirm }) => {
  const isBlocked = user?.status === "blocked";

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        {isBlocked ? "Unblock User" : "Block User"}
      </h2>

      <p className="text-gray-700 mb-6">
        Are you sure you want to{" "}
        <span className="font-semibold">{isBlocked ? "unblock" : "block"}</span>{" "}
        the user <span className="font-bold">{user?.email}</span>?
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            onClose();
            onConfirm(user);
          }}
          className={`px-4 py-2 rounded text-white ${
            isBlocked
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {isBlocked ? "Unblock" : "Block"}
        </button>
      </div>
    </div>
  );
};

UserBlockModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  user: PropTypes.shape({
    email: PropTypes.string,
    status: PropTypes.string,
  }),
};

export default UserBlockModal;
