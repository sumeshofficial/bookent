import dotenv from "dotenv";
import {
  countOrganizers,
  findOrganizerById,
  getOrganizers,
  updateOrganizer,
} from "../repositories/organizer/organizer.repository.js";
import {
  countStadiums,
  getStadiums,
  isStadiumExists,
} from "../repositories/organizer/stadium.repository.js";
import {
  aggregateEvents,
  countDocuments,
} from "../repositories/organizer/event.repository.js";
dotenv.config();

// Get all organizers
export const getAllOrganizers = async ({
  limit,
  skip,
  search,
  sort,
  status,
}) => {
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
  if (sort === "oldest") {
    sortOption = { createdAt: 1 };
  }
  if (sort === "a-z") {
    sortOption = { "organizationDetails.name": 1 };
  }
  if (sort === "z-a") {
    sortOption = { "organizationDetails.name": -1 };
  }

  const organizers = await getOrganizers({ query, sortOption, skip, limit });

  const totalOrganizers = await countOrganizers(query);
  return { totalOrganizers, organizers };
};

// Update organizer request
export const updateRequest = async ({ id, status, reason }) => {
  const organizer = await findOrganizerById(id);

  organizer.status = status;
  if (status === "rejected") {
    organizer.rejectReason = reason;
  }
  if (status === "approved") {
    organizer.isVerified = true;
    organizer.rejectReason = null;
  }
  await organizer.save();

  return organizer;
};

// Check stadium is exists
export const stadiumExists = async (name, stadiumId) => {
  const query = {
    "stadiumDetails.stadiumName": {
      $regex: new RegExp(`^${name}$`, "i"),
    },
    isDeleted: false,
  };

  if (stadiumId) {
    query._id = { $ne: stadiumId };
  }

  return isStadiumExists(query);
};

// Fetch events
export const fetchEventsWithOrganizerId = async ({
  query,
  sortOption,
  skip,
  limit,
}) => {
  const aggregationPipeline = [
    { $match: { ...query, isDeleted: false } },
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "eventId",
        as: "orders",
      },
    },
    {
      $addFields: {
        totalTicketsSold: {
          $sum: {
            $map: {
              input: "$orders",
              as: "order",
              in: "$$order.seat.qty",
            },
          },
        },

        grossTicketSales: {
          $sum: {
            $map: {
              input: "$orders",
              as: "order",
              in: {
                $multiply: ["$$order.seat.price", "$$order.seat.qty"],
              },
            },
          },
        },

        refundedAmount: {
          $sum: {
            $map: {
              input: "$orders",
              as: "order",
              in: {
                $cond: [
                  { $eq: ["$$order.status", "REFUNDED"] },
                  "$$order.refundedAmount",
                  0,
                ],
              },
            },
          },
        },
      },
    },
    {
      $addFields: {
        organizerNetRevenue: {
          $subtract: ["$grossTicketSales", "$refundedAmount"],
        },
      },
    },
    { $sort: sortOption },
    { $skip: skip },
    { $limit: limit },
    {
      $project: {
        orders: 0,
        refundedAmount: 0,
      },
    },
  ];

  const events = await aggregateEvents(aggregationPipeline);

  const total = await countDocuments(query);
  const totalPages = Math.ceil(total / limit);
  return { events, total, totalPages };
};

// Update organizer profile
export const updateOrganizerService = async ({ id, data }) => {
  const updateFields = {};

  if (data.fullname) {
    updateFields.fullname = data.fullname;
  }

  if (data.email) {
    updateFields.email = data.email;
  }

  if (data.status) {
    updateFields.status = data.status;
  }

  if (data.paypalEmail) {
    updateFields.paypalEmail = data.paypalEmail;
  }

  if (data.profileImage) {
    updateFields.profileImage = data.profileImage;
  }

  if (data.organizationDetails) {
    Object.entries(data.organizationDetails).forEach(([key, value]) => {
      updateFields[`organizationDetails.${key}`] = value;
    });
  }

  if (data.bankAccountDetails) {
    Object.entries(data.bankAccountDetails).forEach(([key, value]) => {
      updateFields[`bankAccountDetails.${key}`] = value;
    });
  }

  const updatedOrganizer = await updateOrganizer(id, updateFields);

  return updatedOrganizer;
};

// Find all stadiums for organizer
export const findAllStadiumsWithOrgnaizerId = async ({
  query,
  sortOption,
  skip,
  limit,
}) => {
  const stadiums = await getStadiums({ query, sortOption, skip, limit });

  const total = await countStadiums(query);
  const totalPages = Math.ceil(total / limit);
  return { stadiums, total, totalPages };
};
