import {
  checkOrganizer,
  createOrganizer,
  createStadiumFn,
  findStadiums,
  stadiumExists,
} from "../services/organizer.service.js";
import { getObjectURL } from "../services/s3.service.js";

// Register Organizer
export const organizerAccountRegister = async (req, res) => {
  const { userId, organizationDetails, bankAccountDetails } = req.body;
  try {
    if (
      !userId ||
      !organizationDetails?.name ||
      !organizationDetails?.address ||
      !organizationDetails?.state ||
      !bankAccountDetails?.accountNumber
    ) {
      return res.status(422).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const organization = await createOrganizer({
      userId,
      organizationDetails,
      bankAccountDetails,
    });

    return res.status(201).json({
      success: true,
      message: "Organizer registered successfully",
      data: organization,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

// Get organizer
export const organizerDashboard = async (req, res) => {
  const userId = req.params.id;
  try {
    if (!userId) {
      return res.status(422).json({
        success: false,
        error: "Missing Field",
      });
    }

    const organizer = await checkOrganizer({ userId });

    return res.status(200).json({
      success: true,
      message: "Chceking Succesfully",
      organizer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went worng",
    });
  }
};

// Create Stadium
export const createStadium = async (req, res) => {
  try {
    const { stadiumDetails, shapes, layoutImageKey, organizerId } = req.body;

    if (!shapes || !stadiumDetails || !layoutImageKey || !organizerId)
      return res.status(422).json({ success: false, message: "Missing field" });

    const payload = {
      organizerId,
      stadiumDetails,
      shapes,
      layoutImageKey,
    };

    const stadium = await createStadiumFn(payload);

    res.status(201).json({
      success: true,
      message: "Stadium created successfully",
      stadium,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Something went worng",
    });
  }
};

export const getStadiums = async (req, res) => {
  try {
    const organizer = await checkOrganizer({ userId: req.user._id });
    if (!organizer) {
      return res.status(404).json({
        success: false,
        message: "Organizer profile not found",
      });
    }

    const stadiums = await findStadiums(organizer._id);

    if (!stadiums || stadiums.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Stadiums Found",
        stadiums: [],
      });
    }

    const updatedStadiums = await Promise.all(
      stadiums.map(async (stadium) => ({
        ...stadium,
        layoutImage: await getObjectURL(stadium.layoutImageKey),
      }))
    );

    res.status(200).json({
      success: true,
      message: "Stadiums fetched successfully",
      stadiums: updatedStadiums,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Something went wrong",
    });
  }
};

export const checkStadiumName = async (req, res) => {
  try {
    const { name } = req.query;
    const organizer = await checkOrganizer({ userId: req.user._id });

    if (!name)
      return res
        .status(422)
        .json({ success: false, error: "Name is required" });

    if (!organizer)
      return res
        .status(400)
        .json({ success: false, error: "Organizer not found" });

    const exists = await stadiumExists(name, organizer._id);

    res.status(200).json({
      success: true,
      exists: !!exists,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};
