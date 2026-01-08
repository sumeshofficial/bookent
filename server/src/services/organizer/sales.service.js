import { findEvents } from "../../repositories/organizer/event.repository.js";
import { fetchOrdersForOrganizer } from "../../repositories/organizer/order.repository.js";
import { buildOrdersQuery } from "../helper/buildOrderQuery.js";
import { exportSalesExcel } from "./helper/exportExcel.js";
import { exportSalesPDF } from "./helper/exportPdf.js";
import { validateOrganizer } from "./helper/validateOrganizer.helper.js";

export const getSalesReport = async (userId, filters) => {
  const organizer = await validateOrganizer(userId);

  const events = await findEvents(organizer._id);

  const eventIds = events.map((e) => e._id);

  const queryPayload = buildOrdersQuery({ ...filters });

  return await fetchOrdersForOrganizer({ ...queryPayload, eventIds });
};

export const exportSalesReportAsPDF = async (userId, filters) => {
  const organizer = await validateOrganizer(userId);

  const events = await findEvents(organizer._id);

  const eventIds = events.map((e) => e._id);

  const queryPayload = buildOrdersQuery({
    ...filters,
    isExport: true,
  });

  const report = await fetchOrdersForOrganizer({ ...queryPayload, eventIds });

  return exportSalesPDF({
    rows: report.data,
    summary: report.summary,
  });
};

export const exportSalesReportAsExcel = async (userId, filters) => {
  const organizer = await validateOrganizer(userId);

  const events = await findEvents(organizer._id);

  const eventIds = events.map((e) => e._id);

  const queryPayload = buildOrdersQuery({
    ...filters,
    isExport: true,
  });

  const report = await fetchOrdersForOrganizer({ ...queryPayload, eventIds });

  return exportSalesExcel({
    rows: report.data,
    summary: report.summary,
  });
};
