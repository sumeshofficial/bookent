import {
  bookingConfirmationTemplate,
  sendEmail,
} from "../../../../notifications/email.service.js";
import { generateInvoicePDF } from "../../../../helper/generateInvoicePdf.js";
import {
  formatDate,
  formatTime,
} from "../../../../../utility/formatDateAndTime.js";
import { generateQRCode } from "../../../../helper/generateQrCode.js";

export const sendEmailConfirmation = async (user, order) => {
  const subject = "🎟️ Booking Confirmed – Your Tickets Are Ready";
  const invoicePdfBuffer = await generateInvoicePDF({ order, user });
  const qrImageBuffer = await generateQRCode(order.qrData.data);

  await sendEmail({
    to: user.email,
    subject,
    html: bookingConfirmationTemplate({
      fullname: user.fullname,
      orderId: order.orderId,
      eventTitle: order.eventDetails.title,
      eventDate: formatDate(order.eventDetails.date),
      eventTime: formatTime(order.eventDetails.time),
      venue: order.eventDetails.venue,
      qty: order.seat.qty,
      orderAmount: order.pricingBreakDown.orderAmount,
      discount: order.pricingBreakDown.discount || 0,
      totalAmount: order.pricingBreakDown.grandTotal,
    }),
    attachments: [
      {
        filename: "ticket-qr.png",
        content: qrImageBuffer,
        contentType: "image/png",
        cid: "ticketqr",
      },
      {
        filename: "invoice.pdf",
        content: invoicePdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
};
