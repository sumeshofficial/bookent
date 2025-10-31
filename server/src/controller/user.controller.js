import dotenv from "dotenv";
import { updateUserService } from "../services/user.service.js";
dotenv.config();

export const updateUser = async (req, res) => {
  const { id, data } = req.body;

  try {
    if (!id || !data) {
      return res
        .status(422)
        .json({ success: false, message: "Missing fields" });
    }

    const user = await updateUserService({ id, data });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Updated Successfully", user });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
