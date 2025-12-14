import { getObjectURL } from "../../s3.service.js";

export const buildTicketDetails = async (order) => {
  const poster = await getObjectURL(order.eventDetails.thumbnailImage);

  return {
    bookingId: order._id.toString(),

    event: {
      id: order.eventDetails?._id,
      title: order.eventDetails?.title,
      date: order.eventDetails?.date,
      time: order.eventDetails?.time,
      venue: order.eventDetails?.venue,
      poster: poster,
    },

    section: order.seat?.category,
    qty: order.seat?.qty,

    totalAmount: order.total_amount?.value,
    currency: order.total_amount?.currency,
    pricing: order.pricingBreakDown,

    qrData: order.qrData,

    paymentMethod: order.paymentMethod,
    status: order.status,

    bookedAt: order.createdAt,
  };
};
