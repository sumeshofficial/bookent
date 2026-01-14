import PDFDocument from "pdfkit";
import { formatDate } from "../../utility/formatDateAndTime.js";
import { ENV } from "../../config/env.conf.js";

export const generateInvoicePDF = async ({ order, user }) => {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const buffers = [];

  const pdfPromise = new Promise((resolve, reject) => {
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);
  });

  doc.fontSize(26).font("Helvetica-Bold").text("INVOICE", 50, 50);

  doc
    .fontSize(10)
    .font("Helvetica")
    .text("BOOKENT Pvt Ltd\nKochi, Kerala\nsupport@bookent.com", 50, 95);

  const logoUrl = ENV.LOGO_URL;

  try {
    const response = await fetch(logoUrl);
    const arrayBuffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    doc.image(imageBuffer, 400, 50, {
      fit: [120, 60],
      align: "right",
    });
  } catch (error) {
    console.error("Logo load failed:", error);
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("BOOKENT", 400, 60, { align: "right" });
  }

  const billingTop = 95;

  doc.fontSize(10).font("Helvetica-Bold").text("Billed To", 350, billingTop);

  doc.font("Helvetica").text(user.fullname, 350).text(user.email, 350);

  doc.moveDown(1);

  doc.font("Helvetica-Bold").text("Invoice Number", 350);

  doc.font("Helvetica").text(order.orderId, 350, doc.y);

  doc.moveDown(0.5);

  doc.font("Helvetica-Bold").text("Date of Issue", 350);

  doc.font("Helvetica").text(formatDate(new Date()), 350);

  doc.moveDown(2);

  const tableTop = doc.y;
  const col = {
    desc: 50,
    qty: 320,
    price: 390,
    total: 470,
  };

  const colWidth = {
    desc: 240,
    qty: 40,
    price: 60,
    total: 70,
  };

  const tableEndX = col.total + colWidth.total;
  const rightEdgeX = doc.page.width - doc.page.margins.right;
  const totalsStartX = col.qty;

  doc
    .fontSize(11)
    .font("Helvetica-Bold")
    .text("Description", col.desc, tableTop, { width: colWidth.desc })
    .text("Qty", col.qty, tableTop, { width: colWidth.qty, align: "right" })
    .text("Price", col.price, tableTop, {
      width: colWidth.price,
      align: "right",
    })
    .text("Amount", col.total, tableTop, {
      width: colWidth.total,
      align: "right",
    });

  doc
    .moveTo(50, tableTop + 15)
    .lineTo(tableEndX, tableTop + 15)
    .stroke();

  const rowY = tableTop + 30;
  const seatTotal = order.seat.qty * order.seat.price;

  const descriptionText = `${order.eventId.eventTitle} (${order.seat.category})`;

  doc.fontSize(10).font("Helvetica").text(descriptionText, col.desc, rowY, {
    width: colWidth.desc,
  });

  const descHeight = doc.heightOfString(descriptionText, {
    width: colWidth.desc,
  });

  doc
    .text(order.seat.qty.toString(), col.qty, rowY, {
      width: colWidth.qty,
      align: "right",
    })
    .text(`$${order.seat.price.toFixed(2)}`, col.price, rowY, {
      width: colWidth.price,
      align: "right",
    })
    .text(`$${seatTotal.toFixed(2)}`, col.total, rowY, {
      width: colWidth.total,
      align: "right",
    });

  doc.y = rowY + descHeight + 20;

  const breakdown = order.pricingBreakDown;
  let y = doc.y;

  const amountRow = (label, value) => {
    doc.fontSize(10).text(label, totalsStartX, y);
    doc.text(`$${value.toFixed(2)}`, 0, y, { align: "right" });
    y += 18;
  };

  doc
    .moveTo(totalsStartX, y - 5)
    .lineTo(rightEdgeX, y - 5)
    .stroke();

  amountRow("Subtotal", breakdown.ticketPrice);

  const fees = (breakdown.baseFee || 0) + (breakdown.gst || 0);
  amountRow("Fees & Taxes", fees);

  if (breakdown.discount && breakdown.discount > 0) {
    amountRow("Discount", -breakdown.discount);
  }

  doc
    .moveTo(totalsStartX, y + 5)
    .lineTo(rightEdgeX, y + 5)
    .stroke();

  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Total", totalsStartX, y + 12);
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text(`$${breakdown.grandTotal.toFixed(2)}`, 0, y + 12, {
      align: "right",
    });

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("Terms", 50, y + 20);

  doc
    .font("Helvetica")
    .text("Net 30 days. Payment is due within 30 days of invoice date.", 50);

  doc.moveDown(5);
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

  doc.moveDown(1);

  doc
    .fontSize(9)
    .fillColor("gray")
    .text("BOOKENT Pvt Ltd • support@bookent.com • www.bookent.com", {
      align: "center",
    })
    .moveDown(0.5)
    .text(
      "This is a system-generated invoice and does not require a signature.",
      { align: "center" }
    );

  doc.fillColor("black");
  doc.end();

  return pdfPromise;
};
