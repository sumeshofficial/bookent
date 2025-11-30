import { updateOrganizerService } from "../../services/organizer.service.js";
import { getObjectURL } from "../../services/s3.service.js";
import { statusCode } from "../../utility/constants.js";

export const updateOrganizerProfile = async (req, res) => {
  const { id, data } = req.body;

  try {
    if (!id || !data) {
      return res
        .status(statusCode.missingField)
        .json({ success: false, message: "Missing fields" });
    }

    const organizer = await updateOrganizerService({ id, data });

    if (!organizer) {
      return res
        .status(statusCode.notFound)
        .json({ success: false, message: "User not found" });
    }

    if (organizer.profileImage && organizer.profileImage.includes("uploads")) {
      const url = await getObjectURL(organizer.profileImage);
      organizer.profileImage = url;
    }

    return res
      .status(statusCode.success)
      .json({ success: true, message: "Updated Successfully", organizer });
  } catch (error) {
    return res
      .status(statusCode.serverError)
      .json({ success: false, error: error.message });
  }
};
