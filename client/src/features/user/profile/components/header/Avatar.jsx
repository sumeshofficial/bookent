import CropImageProfile from "../../../../../components/user/CropImageProfile";

const Avatar = ({ user, imageUpdate }) => (
  <CropImageProfile
    imageUpdate={imageUpdate}
    label="Change Profile"
    user={user}
  />
);

export default Avatar;
