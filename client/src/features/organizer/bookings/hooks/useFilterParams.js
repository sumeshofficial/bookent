import { useSearchParams } from "react-router-dom";

export const useFilterParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const get = (key, fallback = "") =>
    searchParams.get(key) || fallback;

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);

    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    params.set("page", "1");
    setSearchParams(params);
  };

  return {
    fromDate: get("from"),
    toDate: get("to"),
    seatCategory: get("seatCategory"),
    search: get("search"),
    sortBy: get("sort", "LATEST"),
    updateParam,
  };
};