import { aggregateOrders } from "../../../../repositories/organizer/order.repository.js";
import { ORDER_STATUS } from "../../../../utility/constants/constants.js";
import { getObjectURL } from "../../../s3.service.js";

export const getTopFiveEvents = async ({ organizerId, fromDate, toDate }) => {
  const matchStage = {
    status: {
      $in: [ORDER_STATUS.PAID, ORDER_STATUS.CONFIRMED, ORDER_STATUS.REFUNDED],
    },
  };

  if (fromDate || toDate) {
    matchStage.createdAt = {};
    if (fromDate) {
      matchStage.createdAt.$gte = new Date(fromDate);
    }
    if (toDate) {
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      matchStage.createdAt.$lte = end;
    }
  }

  const pipeline = [
    { $match: matchStage },

    {
      $lookup: {
        from: "events",
        localField: "eventId",
        foreignField: "_id",
        as: "event",
      },
    },
    {
      $unwind: "$event",
    },

    {
      $match: {
        "event.organizer": organizerId,
        "event.eventStatus": "Published",
        "event.isDeleted": false,
      },
    },

    {
      $addFields: {
        grossTicketSales: {
          $multiply: ["$seat.price", "$seat.qty"],
        },
        refundedAmount: { $ifNull: ["$refundedAmount", 0] },
      },
    },

    {
      $addFields: {
        organizerNetRevenue: {
          $subtract: ["$grossTicketSales", "$refundedAmount"],
        },
      },
    },

    {
      $group: {
        _id: "$eventId",
        eventTitle: { $first: "$event.eventTitle" },
        eventSlug: { $first: "$event.slug" },
        stadiumName: { $first: "$event.stadiumName" },
        thumbnailImageKey: { $first: "$event.thumbnailImageKey" },

        totalOrders: { $sum: 1 },
        totalTicketsSold: { $sum: "$seat.qty" },
        grossTicketSales: { $sum: "$grossTicketSales" },
        totalRefunded: { $sum: "$refundedAmount" },
        organizerNetRevenue: { $sum: "$organizerNetRevenue" },
      },
    },

    { $sort: { organizerNetRevenue: -1 } },

    { $limit: 5 },

    {
      $project: {
        _id: 0,
        eventId: "$_id",
        eventTitle: 1,
        eventSlug: 1,
        stadiumName: 1,
        thumbnailImageKey: 1,
        totalOrders: 1,
        totalTicketsSold: 1,
        grossTicketSales: 1,
        totalRefunded: 1,
        organizerNetRevenue: 1,
      },
    },
  ];

  const events = await aggregateOrders(pipeline);

  const updatedEvents = await Promise.all(
    events.map(async (event) => ({
      ...event,
      thumbnailImage: await getObjectURL(event.thumbnailImageKey),
    }))
  );

  return updatedEvents;
};
