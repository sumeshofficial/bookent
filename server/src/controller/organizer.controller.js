import {
  checkOrganizer,
  createOrganizer,
} from "../services/organizer.service.js";

// Register Organizer
export const organizarAccountRegister = async (req, res) => {
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
    console.log(error);
    res.status(500).json({ success: false, error: "Something went wrong" });
  }
};

// Get organizer
export const organizarDashboard = async (req, res) => {
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
