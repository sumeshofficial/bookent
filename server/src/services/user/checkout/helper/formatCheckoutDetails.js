export const formatCheckoutDetails = (
  meta,
  event,
  sectionShape,
  sectionTicketDetails,
  fee
) => {
  const eventDetails = {
    _id: event._id,
    title: event.eventTitle,
    date: event.matchDate,
    venue: event.stadiumAddress,
    time: event.matchTime,
    slug: event.slug,
    stadiumName: event.stadiumName,
    thumbnailImage: event.thumbnailImageKey,
  };

  const sectionDetails = {
    _id: sectionShape.id,
    name: sectionShape.title,
    price: sectionTicketDetails,
    qty: Number(meta.qty),
  };

  const pricingDetails = {
    ticketPrice: fee.ticketPrice,
    orderAmount: fee.orderAmount,
    baseFee: fee.baseFee,
    gst: fee.gst,
    bookingFee: fee.bookingFee,
    grandTotal: fee.grandTotal,
  };

  return { eventDetails, sectionDetails, pricingDetails };
};
