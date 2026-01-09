import { getDashboardStats } from "./helper/getDashboardStats.js";
import { getMonthlySales } from "./helper/getMonthlySales.js";
import { getRecentOrders } from "./helper/getRecentOrders.js";
import { getRevenueSplit } from "./helper/getRevenueSplit.js";
import { getSalesStatistics } from "./helper/getSalesStatistics.js";

export const getAdminDashboard = async (filters = {}) => {
  const [stats, monthlySales, revenueSplit, statistics, recentOrders, ] =
    await Promise.all([
      getDashboardStats(filters),
      getMonthlySales(filters),
      getRevenueSplit(filters),
      getSalesStatistics(filters),
      getRecentOrders(),
    ]);

  return {
    stats,
    monthlySales,
    revenueSplit,
    statistics,
    recentOrders,
  };
};
