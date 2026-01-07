import { adminApi } from "../../../../services/api/apiSetup";


export const fetchSalesReport = async (params) => {
  const { data } = await adminApi.get("/admin/sales", { params });
  return data;
};

export const exportSalesReport = async (type, params) => {
  const response = await adminApi.get(`/admin/sales/export/${type}`, {
    params,
    responseType: "blob",
  });

  return response;
};