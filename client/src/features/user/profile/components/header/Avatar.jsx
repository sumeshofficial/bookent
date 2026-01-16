import PropTypes from "prop-types";
import CropImageProfile from "../../../../../components/user/CropImageProfile";

const Avatar = ({ user, imageUpdate }) => (
  <CropImageProfile
    imageUpdate={imageUpdate}
    label="Change Profile"
    user={user}
  />
);

Avatar.propTypes = {
  user: PropTypes.object.isRequired,
  imageUpdate: PropTypes.func.isRequired,
};

export default Avatar;
