import PDFDocument from "pdfkit";

export const exportSalesPDF = ({ rows, summary }) => {
  const doc = new PDFDocument({ margin: 40, size: "A4", bufferPages: true });
  const pageWidth =
    doc.page.width - doc.page.margins.left - doc.page.margins.right;

  const formatCurrency = (v = 0) =>
    `$${Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const colors = {
    brand: "#4338ca",
    textMain: "#0f172a",
    textMuted: "#64748b",
    border: "#e2e8f0",
    danger: "#be123c",
    success: "#15803d",
  };

  doc
    .fillColor(colors.brand)
    .fontSize(22)
    .font("Helvetica-Bold")
    .text("SALES EXECUTIVE SUMMARY");

  doc.moveDown(0.2);
  doc.rect(doc.x, doc.y, 40, 3).fill(colors.brand);

  doc.moveDown(0.5);
  doc
    .fillColor(colors.textMuted)
    .fontSize(8)
    .font("Helvetica")
    .text(`REPORT ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`)
    .text(`GENERATED: ${new Date().toLocaleString().toUpperCase()}`);

  doc.moveDown(2);

  doc
    .fillColor(colors.textMain)
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("FINANCIAL PERFORMANCE");
  doc.moveDown(0.8);

  const summaryGrid = [
    { label: "Total Orders", value: summary.totalOrders },
    { label: "Gross Sales", value: formatCurrency(summary.grossTicketSales) },
    {
      label: "Total Discounts",
      value: `(${formatCurrency(summary.totalDiscount)})`,
    },
    {
      label: "Platform Gross",
      value: formatCurrency(summary.platformGrossCollected),
    },
    { label: "Gateway Fees", value: formatCurrency(summary.totalGatewayFees) },
    {
      label: "Total Refunds",
      value: formatCurrency(summary.totalRefunded || 0),
    },
    {
      label: "NET REVENUE",
      value: formatCurrency(summary.platformNetRevenue),
      highlight: true,
    },
  ];

  const colCount = 4;
  const cellWidth = pageWidth / colCount;
  const startY = doc.y;

  summaryGrid.forEach((item, i) => {
    const col = i % colCount;
    const row = Math.floor(i / colCount);
    const x = doc.page.margins.left + col * cellWidth;
    const y = startY + row * 45;

    doc
      .fillColor(colors.textMuted)
      .fontSize(7)
      .font("Helvetica-Bold")
      .text(item.label.toUpperCase(), x, y);
    doc
      .fillColor(item.highlight ? colors.brand : colors.textMain)
      .fontSize(11)
      .font("Helvetica-Bold")
      .text(String(item.value), x, y + 12);

    if (col < colCount - 1) {
      doc
        .moveTo(x + cellWidth - 15, y)
        .lineTo(x + cellWidth - 15, y + 25)
        .strokeColor(colors.border)
        .lineWidth(1)
        .stroke();
    }
  });

  doc.y = startY + Math.ceil(summaryGrid.length / colCount) * 45 + 10;

  const colWidths = {
    orderId: 100,
    date: 70,
    gross: 70,
    discount: 60,
    net: 75,
    status: 70,
  };

  const colPositions = {
    orderId: doc.page.margins.left,
    date: doc.page.margins.left + colWidths.orderId,
    gross: doc.page.margins.left + colWidths.orderId + colWidths.date,
    discount:
      doc.page.margins.left +
      colWidths.orderId +
      colWidths.date +
      colWidths.gross,
    net:
      doc.page.margins.left +
      colWidths.orderId +
      colWidths.date +
      colWidths.gross +
      colWidths.discount,
    status:
      doc.page.margins.left +
      colWidths.orderId +
      colWidths.date +
      colWidths.gross +
      colWidths.discount +
      colWidths.net,
  };

  const drawTableHeader = (y) => {
    doc.rect(doc.page.margins.left, y, pageWidth, 20).fill("#f1f5f9");
    doc.fillColor(colors.textMuted).font("Helvetica-Bold").fontSize(7);

    const headers = [
      "ORDER ID",
      "DATE",
      "GROSS",
      "DISCOUNT",
      "PLAT. NET",
      "STATUS",
    ];
    const keys = ["orderId", "date", "gross", "discount", "net", "status"];

    keys.forEach((key, i) => {
      const align = ["gross", "discount", "net"].includes(key)
        ? "right"
        : "left";
      doc.text(headers[i], colPositions[key] + 5, y + 7, {
        width: colWidths[key] - 10,
        align,
      });
    });
  };

  drawTableHeader(doc.y);
  let yPos = doc.y + 25;

  rows.forEach((r) => {
    if (yPos > doc.page.height - 60) {
      doc.addPage();
      yPos = doc.page.margins.top;
      drawTableHeader(yPos);
      yPos += 25;
    }

    doc.fillColor(colors.textMain).font("Helvetica").fontSize(8);

    const displayId =
      r.orderId.length > 18 ? r.orderId.substring(0, 15) + "..." : r.orderId;

    doc.text(displayId, colPositions.orderId + 5, yPos);
    doc.text(
      new Date(r.createdAt).toLocaleDateString(),
      colPositions.date + 5,
      yPos
    );
    doc.text(formatCurrency(r.grossTicketSales), colPositions.gross, yPos, {
      align: "right",
      width: colWidths.gross - 10,
    });
    doc.text(`-${r.discount}`, colPositions.discount, yPos, {
      align: "right",
      width: colWidths.discount - 10,
    });

    const netRev = r.platformNetRevenue || 0;
    doc
      .fillColor(netRev < 0 ? colors.danger : colors.textMain)
      .font("Helvetica-Bold")
      .text(formatCurrency(netRev), colPositions.net, yPos, {
        align: "right",
        width: colWidths.net - 10,
      });

    doc
      .fillColor(r.status === "CONFIRMED" ? colors.success : colors.textMuted)
      .fontSize(7)
      .text(r.status, colPositions.status + 5, yPos);

    doc
      .moveTo(doc.page.margins.left, yPos + 12)
      .lineTo(doc.page.margins.left + pageWidth, yPos + 12)
      .strokeColor(colors.border)
      .lineWidth(0.5)
      .stroke();

    yPos += 20;
  });

  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i++) {
    doc.switchToPage(i);
    doc
      .fontSize(7)
      .fillColor(colors.textMuted)
      .text(
        `INTERNAL USE ONLY  |  PAGE ${i + 1} OF ${pages.count}`,
        0,
        doc.page.height - 30,
        { align: "center", width: doc.page.width }
      );
  }

  doc.end();
  return doc;
};
