import {
  getOrder,
  getOrdersWithUserId,
} from "../../repositories/user/order.repository.js";
import { ERRORS } from "../../utility/constants/constants.js";
import { STATUS_CODE } from "../../utility/constants/statusCode.js";
import { AppError } from "../../utility/helpers.js";
import { generateInvoicePDF } from "../helper/generateInvoicePdf.js";
import { getObjectURL } from "../s3.service.js";
import { buildTicketDetails } from "./helper/buildTicketDetails.js";
import { ticketsQueryBuilder } from "./helper/ticketsQueryBuilder.helper.js";

export const getTickets = async (userId, data) => {
  const { search, status, sort, page = 1, limit = 5 } = data;

  const { query, sortQuery } = ticketsQueryBuilder({
    userId,
    search,
    status,
    sort,
  });

  const { orders, meta } = await getOrdersWithUserId(
    query,
    sortQuery,
    page,
    limit
  );

  const updatedOrders = [];

  for (const order of orders) {
    const thumbnailUrl = order.eventDetails?.thumbnailImage
      ? await getObjectURL(order.eventDetails.thumbnailImage)
      : null;

    updatedOrders.push({
      ...order,
      eventDetails: {
        ...order.eventDetails,
        thumbnailImage: thumbnailUrl,
      },
    });
  }

  return { updatedOrders, meta };
};

export const getTicketForOrderId = async (orderId, user) => {
  const order = await getOrder(orderId, user._id);

  if (!order) {
    throw new AppError(
      STATUS_CODE.NOTFOUND,
      ERRORS.ORDER_NOTFOUND.CODE,
      ERRORS.ORDER_NOTFOUND.MSG
    );
  }

  const ticket = await buildTicketDetails(order);
  return ticket;
};

export const getInvoicePdf = async (orderId, user) => {
  const order = await getOrder(orderId, user._id);

  const pdfBuffer = await generateInvoicePDF({ order, user });

  return pdfBuffer;
};
