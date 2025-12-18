import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  updateUserProfile,
  updateUserProfileData,
} from "../../../../app/userSlice";
import {
  generateImageUrl,
  generateUploadUrl,
  uploadFile,
} from "../../../../services/s3";
import { useModal } from "../../../../utils/constants";

export const useProfileLogic = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.user);
  const { openModal } = useModal();

  const imageUpdate = async (image) => {
    const previewUrl = URL.createObjectURL(image);

    dispatch(updateUserProfileData({ data: { profileImage: previewUrl } }));
    toast.success("Profile image updated");

    try {
      const { signedUrl, key } = await generateUploadUrl({
        fileName: `profileImg-${user._id}`,
        contentType: image.type,
        folderName: "user/profile",
      });

      await uploadFile({ file: image, contentType: image.type, signedUrl });
      await generateImageUrl(key);

      dispatch(
        updateUserProfile({ id: user._id, data: { profileImage: key } })
      );
    } catch (error) {
      toast.error(error.message || "Failed to upload image");
    }
  };

  const submitPreferences = async (formData) => {
    const data = { preferences: { ...formData } };

    dispatch(updateUserProfileData(data));
    toast.success("Preferences updated successfully!");

    try {
      dispatch(updateUserProfile({ id: user._id, data }));
    } catch (err) {
      toast.error(err?.message || "Failed to save preferences");
    }
  };

  return {
    user,
    imageUpdate,
    submitPreferences,
    openEditModal: () => openModal("edit-profile"),
  };
};
