import { api } from "../../../../services/api/apiSetup";

export const fetchSalesReport = async (params) => {
  const { data } = await api.get("/organizer/sales", { params });
  return data;
};

export const exportSalesReport = async (type, params) => {
  const response = await api.get(`/organizer/sales/export/${type}`, {
    params,
    responseType: "blob",
  });

  return response;
};
