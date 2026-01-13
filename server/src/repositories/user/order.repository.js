import Order from "../../models/order.model.js";

export const getOrderForPaypal = async (paypalOrderId, session = null) => {
  return Order.findOne({ paypalOrderId }, null, {
    session,
  }).populate("eventId");
};

export const createOrder = async (data, session) => {
  const order = await Order.create([data], { session });
  return order[0];
};

export const updateOrderStatus = async (orderId, status, session) => {
  await Order.findOneAndUpdate({ _id: orderId }, { status }, { session });
};

export const updateOrder = async (orderId, payload, session) => {
  return await Order.findOneAndUpdate({ _id: orderId }, payload, {
    new: true,
    session,
  }).populate("eventId");
};

export const getOrdersWithUserId = async (
  query,
  sortQuery = {},
  page = 1,
  limit = 5
) => {
  page = Math.max(1, Number(page) || 1);
  limit = Math.max(1, Number(limit) || 5);

  const skip = (page - 1) * limit;

  const result = await Order.aggregate([
    { $match: query },
    { $sort: sortQuery },

    {
      $lookup: {
        from: "events",
        localField: "eventId",
        foreignField: "_id",
        as: "event",
      },
    },
    { $unwind: "$event" },

    {
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        meta: [{ $count: "total" }],
      },
    },
  ]);

  const orders = result[0].data;
  const total = result[0].meta[0]?.total || 0;

  return {
    orders,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getOrder = async (orderId, userId) => {
  return Order.findOne({ orderId, userId }).populate("eventId");
};
