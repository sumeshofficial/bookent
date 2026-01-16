import CropImageProfile from "../../../../components/user/CropImageProfile";
import { Edit } from "lucide-react";
import PropTypes from "prop-types";

const ProfileHeader = ({ user, openModal, updateImage }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
      <div className="relative inline-block mb-6">
        <div className="w-32 h-32 rounded-full flex items-center justify-center">
          <CropImageProfile
            imageUpdate={updateImage}
            label="Change Profile"
            user={user}
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{user.fullname}</h2>

        <button
          onClick={() => openModal("edit-profile")}
          className="text-gray-500 hover:text-gray-700"
        >
          <Edit size={18} />
        </button>
      </div>
    </div>
  );
};

ProfileHeader.propTypes = {
  user: PropTypes.shape({
    fullname: PropTypes.string.isRequired,
  }).isRequired,
  openModal: PropTypes.func.isRequired,
  updateImage: PropTypes.func.isRequired,
};

export default ProfileHeader;
