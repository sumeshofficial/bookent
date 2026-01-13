import { getObjectURL } from "../../s3.service.js";

export const buildTicketDetails = async (order) => {
  const poster = await getObjectURL(order.eventDetails.thumbnailImage);

  return {
    bookingId: order.orderId.toString(),

    event: {
      id: order.eventDetails?._id,
      title: order.eventDetails?.title,
      date: order.eventId?.matchDate,
      time: order.eventId?.matchTime,
      venue: order.eventId?.stadiumAddress,
      poster: poster,
    },

    section: order.seat?.category,
    qty: order.seat?.qty,

    totalAmount: order.total_amount?.value,
    currency: order.total_amount?.currency,
    pricing: order.pricingBreakDown,

    qrData: order.qrData.data && order.qrData.isUsed ? null : order.qrData.data,

    paymentMethod: order.paymentMethod,
    status: order.status,

    postponeDetails: order?.eventId?.postponeDetails,
    cancelDetails: order?.eventId?.cancelDetails,

    bookedAt: order.createdAt,
  };
};
