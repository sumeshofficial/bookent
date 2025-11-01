import Organizer from "../models/organizer.model.js";

export const createOrganizer = async ({
  userId,
  organizationDetails,
  bankAccountDetails,
}) => {
  return Organizer.create({
    userId,
    organizationDetails,
    bankAccountDetails,
  });
};

export const checkOrganizer = ({ userId }) => {
  return Organizer.findOne({ userId });
};

export const getAllOrganizers = async ({
  role,
  limit,
  skip,
  search,
  sort,
  status,
}) => {
  try {
    const query = {
      ...(search
        ? {
            $or: [
              { "organizationDetails.name": { $regex: search, $options: "i" } },
            ],
          }
        : {}),
      ...(status && status !== "all" ? { status } : {}),
    };

    let sortOption = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "a-z") sortOption = { "organizationDetails.name": 1 };
    if (sort === "z-a") sortOption = { "organizationDetails.name": -1 };

    const organizers = await Organizer.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const totalOrganizers = await Organizer.countDocuments({ ...query });
    return { totalOrganizers, organizers };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateRequest = async ({ id, status }) => {
  const organizer = await Organizer.findById(id);

  organizer.status = status;
  if (status === "approved") {
    organizer.isVerified = true;
  }
  await organizer.save();
};
