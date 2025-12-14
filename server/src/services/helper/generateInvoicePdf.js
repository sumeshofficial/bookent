import PDFDocument from "pdfkit";
import { formatDate, formatTime } from "../../utility/formatDateAndTime.js";

export const generateInvoicePDF = async ({ order, user }) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    doc
      .fontSize(20)
      .text("BOOKENT", { align: "left" })
      .fontSize(10)
      .text("Ticket Booking Invoice", { align: "left" });

    doc.moveDown();
    doc.fontSize(12).text("Invoice Details", { underline: true });
    doc.moveDown(0.5);

    doc
      .fontSize(10)
      .text(`Invoice ID: ${order._id}`)
      .text(`Invoice Date: ${formatDate(new Date())}`)
      .text(`Customer: ${user.fullname}`)
      .text(`Email: ${user.email}`);

    doc.moveDown();

    doc.fontSize(12).text("Event Details", { underline: true });
    doc.moveDown(0.5);

    doc
      .fontSize(10)
      .text(`Event: ${order.eventDetails.title}`)
      .text(
        `Date & Time: ${formatDate(order.eventDetails.date)} • ${formatTime(
          order.eventDetails.time
        )}`
      )
      .text(`Venue: ${order.eventDetails.venue}`);

    doc.moveDown();

    const tableTop = doc.y + 10;

    const columnX = {
      description: 50,
      qty: 300,
      price: 360,
      total: 440,
    };

    doc
      .fontSize(11)
      .text("Description", columnX.description, tableTop)
      .text("Qty", columnX.qty, tableTop)
      .text("Price", columnX.price, tableTop)
      .text("Total", columnX.total, tableTop);

    doc
      .moveTo(50, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .stroke();

    const rowY = tableTop + 25;
    const seatTotal = order.seat.qty * order.seat.price;

    doc
      .fontSize(10)
      .text(order.seat.category || "Event Ticket", columnX.description, rowY)
      .text(order.seat.qty.toString(), columnX.qty, rowY)
      .text(`$${order.seat.price.toFixed(2)}`, columnX.price, rowY)
      .text(`$${seatTotal.toFixed(2)}`, columnX.total, rowY);

    doc.moveDown(3);

    const breakdownTop = doc.y;

    doc.fontSize(12).text("Price Breakdown", 350, breakdownTop, {
      align: "left",
      underline: true,
    });

    const breakdown = order.pricingBreakDown;

    const drawAmountRow = (label, value, y) => {
      doc
        .fontSize(10)
        .text(label, 350, y)
        .text(`$${value.toFixed(2)}`, 0, y, { align: "right" });
    };

    let y = breakdownTop + 20;
    drawAmountRow("Ticket Total", breakdown.ticketPrice, y);
    y += 18;
    drawAmountRow("Base Fee", breakdown.baseFee, y);
    y += 18;
    drawAmountRow("GST", breakdown.gst, y);
    y += 18;
    drawAmountRow("Booking Fee", breakdown.bookingFee, y);

    doc
      .moveTo(350, y + 15)
      .lineTo(550, y + 15)
      .stroke();

    doc.fontSize(11).text("Grand Total", 350, y + 25);
    doc.fontSize(11).text(`$${breakdown.grandTotal.toFixed(2)}`, 0, y + 25, {
      align: "right",
    });

    doc.moveDown(4);

    doc
      .fontSize(9)
      .text(
        "This is a system-generated invoice. Please present the QR code at the entry gate.",
        { align: "center", color: "gray" }
      );

    doc.end();
  });
};
