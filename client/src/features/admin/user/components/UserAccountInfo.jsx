import PropTypes from "prop-types";
const UserAccountInfo = ({ user }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">
        Account Information
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>

        <div>
          <p className="text-gray-500">Auth Provider</p>
          <p className="font-medium capitalize">{user.authProvider}</p>
        </div>

        <div>
          <p className="text-gray-500">Joined On</p>
          <p className="font-medium">
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

UserAccountInfo.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    authProvider: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
};

export default UserAccountInfo;
