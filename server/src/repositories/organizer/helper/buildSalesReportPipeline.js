export const buildSalesReportPipeline = (query, sort, skip, limit) => {
  const pipeline = [
    {
      $match: {
        ...query,
      },
    },

    {
      $addFields: {
        grossTicketSales: {
          $multiply: ["$seat.price", "$seat.qty"],
        },

        refundedAmount: {
          $ifNull: ["$refundedAmount", 0],
        },

        organizerNetRevenue: {
          $subtract: [
            { $multiply: ["$seat.price", "$seat.qty"] },
            { $ifNull: ["$refundedAmount", 0] },
          ],
        },
      },
    },

    {
      $sort: sort,
    },

    {
      $facet: {
        data: [
          ...(skip !== undefined ? [{ $skip: skip }] : []),
          ...(limit !== undefined ? [{ $limit: limit }] : []),
          {
            $project: {
              orderId: 1,
              status: 1,
              refundStatus: 1,
              refundedAmount: 1,
              createdAt: 1,
              grossTicketSales: 1,
              organizerNetRevenue: 1,
            },
          },
        ],

        meta: [{ $count: "total" }],

        summary: [
          {
            $group: {
              _id: null,
              totalOrders: { $sum: 1 },
              grossTicketSales: { $sum: "$grossTicketSales" },
              totalRefunded: { $sum: "$refundedAmount" },
              organizerNetRevenue: { $sum: "$organizerNetRevenue" },
            },
          },
        ],
      },
    },
  ];

  return pipeline;
};
