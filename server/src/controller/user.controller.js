import dotenv from "dotenv";
import { updateUserService } from "../services/user.service.js";
import { statusCode } from "../utility/constants.js";
dotenv.config();

// Update user profile or data
export const updateUser = async (req, res) => {
  const { id, data } = req.body;

  try {
    if (!id || !data) {
      return res
        .status(statusCode.missingField)
        .json({ success: false, message: "Missing fields" });
    }

    const user = await updateUserService({ id, data });

    if (!user) {
      return res
        .status(statusCode.notFound)
        .json({ success: false, message: "User not found" });
    }

    return res
      .status(statusCode.success)
      .json({ success: true, message: "Updated Successfully", user });
  } catch (error) {
    return res
      .status(statusCode.serverError)
      .json({ success: false, error: error.message });
  }
};
