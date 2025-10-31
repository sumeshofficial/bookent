import { findOrganizerById, findUserById } from "../services/auth.service.js";
import {
  approveRequest,
  getAllOrganizers,
  rejectRequest,
} from "../services/organizer.service.js";
import { getAllUsers, updateUserStatus } from "../services/user.service.js";

export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const role = req.query.role || "user";
    const sort = req.query.sort || "newest";
    const status = req.query.status || "all";
    const skip = (page - 1) * limit;

    const { totalUsers, users } = await getAllUsers({
      limit,
      skip,
      search,
      role,
      sort,
      status,
    });

    res.json({
      success: true,
      message: "Users fetched successfully",
      page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const updateStatus = async (req, res) => {
  const { id, status: newStatus } = req.params;
  try {
    if (!id || !newStatus) {
      return res.status(422).json({
        success: false,
        message: "userId and status are required",
      });
    }
    await updateUserStatus({ userId: id, newStatus });

    res.json({
      success: true,
      message: "Users status update successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const getUserDetails = async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) {
      return res.status(422).json({ success: false, error: "Missing field" });
    }

    const user = await findUserById(id);

    if (!user)
      return res.status(404).json({ success: false, error: "User not found" });

    return res
      .status(200)
      .json({ success: true, message: "User fetch successfully", user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const getOrganizersDetails = async (req, res) => {
  const id = req.params.id;
  try {
    if (!id) {
      return res.status(422).json({ success: false, error: "Missing field" });
    }

    const organizer = await findOrganizerById(id);

    if (!organizer)
      return res.status(404).json({ success: false, error: "Organizer not found" });

    return res
      .status(200)
      .json({ success: true, message: "Organizer fetch successfully", organizer });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export const getOrganizers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search?.trim() || "";
    const sort = req.query.sort || "newest";
    const status = req.query.status || "all";

    const skip = (page - 1) * limit;

    const { totalOrganizers, organizers } = await getAllOrganizers({
      limit,
      skip,
      search,
      sort,
      status,
    });

    res.status(200).json({
      success: true,
      message: "Organizers fetched successfully",
      currentPage: page,
      totalPages: Math.ceil(totalOrganizers / limit),
      totalOrganizers,
      organizers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch organizers. Please try again later.",
    });
  }
};

export const approveOrganizerRequest = async (req, res) => {
  try {
    const id  = req.params.id;
    if (!id) {
      return res.status(422).json({ success: false, error: "Missing field" });
    }

    await approveRequest(id);

    res.status(200).json({ success: true, message: "Organizer Updated" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
export const rejectOrganizerRequest = async (req, res) => {
  try {
    const id  = req.params.id;
    if (!id) {
      return res.status(422).json({ success: false, error: "Missing field" });
    }

    await rejectRequest(id);

    res.status(200).json({ success: true, message: "Organizer Updated" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
