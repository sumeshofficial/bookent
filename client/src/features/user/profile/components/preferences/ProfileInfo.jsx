import PropTypes from "prop-types";

const ProfileInfo = ({ user, location }) => {
  return (
    <div className="text-left space-y-3 text-sm text-gray-600">
      <p>{user.email}</p>
      <p>{`${location.city}, ${location.state}`}</p>
    </div>
  );
};

ProfileInfo.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProfileInfo;