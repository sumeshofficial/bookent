import { validateOrganizer } from "../helper/validateOrganizer.helper.js";
import { getDashboardStats } from "./helper/getDashboardStats.js";
import { getMonthlySales } from "./helper/getMonthlySales.js";
import { getRecentOrders } from "./helper/getRecentOrders.js";
import { getRevenueSplit } from "./helper/getRevenueSplit.js";
import { getSalesStatistics } from "./helper/getSalesStatistics.js";
import { getTopFiveEvents } from "./helper/getTopFiveEvents.js";

export const getDashboard = async (userId, filters = {}) => {
  const organizer = await validateOrganizer(userId);
  const organizerId = organizer._id;
  const [stats, monthlySales, revenueSplit, statistics, recentOrders, events] =
    await Promise.all([
      getDashboardStats(organizerId, filters),
      getMonthlySales(organizerId, filters),
      getRevenueSplit(organizerId, filters),
      getSalesStatistics(organizerId, filters),
      getRecentOrders(organizerId),
      getTopFiveEvents({ organizerId, ...filters }),
    ]);

  return {
    stats,
    monthlySales,
    revenueSplit,
    statistics,
    recentOrders,
    events,
  };
};
