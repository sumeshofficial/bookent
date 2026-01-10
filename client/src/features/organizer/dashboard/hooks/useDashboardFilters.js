import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

export const useDashboardFilters = () => {
  const [params, setParams] = useSearchParams();

  const filters = useMemo(() => {
    return {
      preset: params.get("preset") || "year",
      year: params.get("year")
        ? Number(params.get("year"))
        : new Date().getFullYear(),
      month: params.get("month") ? Number(params.get("month")) : undefined,
      fromDate: params.get("fromDate") ? params.get("fromDate") : undefined,
      toDate: params.get("toDate") ? params.get("toDate") : undefined,
    };
  }, [params]);

  const updateFilters = (next) => {
    const newParams = new URLSearchParams(params);

    Object.entries(next).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });

    setParams(newParams);
  };

  return { filters, updateFilters };
};
