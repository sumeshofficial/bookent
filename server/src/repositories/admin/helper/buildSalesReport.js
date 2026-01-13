export const buildSalesReportPipeline = (
  matchStage = {},
  sort = { createdAt: -1 },
  skip,
  limit
) => {
  const dataPipeline = [];
  if (typeof skip === "number") {
    dataPipeline.push({ $skip: skip });
  }
  if (typeof limit === "number") {
    dataPipeline.push({ $limit: limit });
  }

  return [
    { $match: matchStage },

    {
      $lookup: {
        from: "transactions",
        let: { orderObjectId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$order_id", "$$orderObjectId"] },
                  { $eq: ["$type", "SALE"] },
                  { $eq: ["$status", "COMPLETED"] },
                ],
              },
            },
          },
        ],
        as: "transaction",
      },
    },

    { $unwind: "$transaction" },

    {
      $addFields: {
        grossTicketSales: {
          $multiply: ["$pricingBreakDown.ticketPrice", "$seat.qty"],
        },
        discount: { $ifNull: ["$pricingBreakDown.discount", 0] },
        platformGrossFee: { $ifNull: ["$pricingBreakDown.bookingFee", 0] },
        gatewayFee: { $ifNull: ["$transaction.transaction_fees.value", 0] },
      },
    },

    {
      $addFields: {
        platformNetRevenue: {
          $subtract: [
            "$platformGrossFee",
            { $add: ["$gatewayFee", "$discount"] },
          ],
        },
      },
    },

    {
      $project: {
        orderId: 1,
        createdAt: 1,
        status: 1,

        grossTicketSales: 1,
        discount: 1,
        netTicketSales: {
          $subtract: [
            { $ifNull: ["$pricingBreakDown.orderAmount", 0] },
            { $ifNull: ["$refundedAmount", 0] },
          ],
        },

        platformGrossFee: 1,
        gatewayFee: 1,
        platformNetRevenue: 1,

        refundStatus: 1,
        refundedAmount: 1,
      },
    },

    { $sort: sort },

    {
      $facet: {
        data: [
          ...(typeof skip === "number" ? [{ $skip: skip }] : []),
          ...(typeof limit === "number" ? [{ $limit: limit }] : []),
        ],

        meta: [{ $count: "total" }],

        summary: [
          {
            $group: {
              _id: null,

              totalOrders: { $sum: 1 },

              grossTicketSales: { $sum: "$grossTicketSales" },
              totalDiscount: { $sum: "$discount" },

              platformGrossCollected: { $sum: "$platformGrossFee" },
              totalGatewayFees: { $sum: "$gatewayFee" },

              platformNetRevenue: { $sum: "$platformNetRevenue" },

              totalRefunded: { $sum: "$refundedAmount" },
            },
          },
        ],
      },
    },
  ];
};
