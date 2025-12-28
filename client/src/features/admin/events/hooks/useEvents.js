import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAdminEvents } from "../services/events.service";

export const useEvents = () => {
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const status = searchParams.get("status") || "All";
  const sort = searchParams.get("sort") || "latest";
  const search = searchParams.get("search") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const category = searchParams.get("category") || "";
  const priceFilter = searchParams.get("priceFilter") || "";

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const filters = {
    page,
    limit,
    status,
    sort,
    search: debouncedSearch,
    startDate,
    endDate,
    category,
    priceFilter,
  };

  return useQuery({
    queryKey: ["admin-events", filters],
    queryFn: () => fetchAdminEvents(filters),
    keepPreviousData: true,
  });
};