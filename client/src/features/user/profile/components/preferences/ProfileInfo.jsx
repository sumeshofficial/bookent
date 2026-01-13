const ProfileInfo = ({ user, location }) => {
  return (
    <div className="text-left space-y-3 text-sm text-gray-600">
      <p>{user.email}</p>
      <p>{`${location.city}, ${location.state}`}</p>
    </div>
  );
};

export default ProfileInfo;
