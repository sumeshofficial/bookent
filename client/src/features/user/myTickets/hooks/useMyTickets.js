import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMyTickets } from "../services/tickets.service";
import { useSearchParams } from "react-router-dom";
import debounce from "lodash.debounce";

export const useMyTickets = () => {
  const [searchParams] = useSearchParams();

  const rawSearch = searchParams.get("search") || "";
  const page = Number(searchParams.get("page"));
  const limit = 5;

  const [debouncedSearch, setDebouncedSearch] = useState(rawSearch);

  const debouncedUpdate = useMemo(
    () =>
      debounce((value) => {
        setDebouncedSearch(value);
      }, 500),
    []
  );

  useEffect(() => {
    debouncedUpdate(rawSearch);

    return () => {
      debouncedUpdate.cancel();
    };
  }, [rawSearch, debouncedUpdate]);

  const params = {
    search: debouncedSearch,
    status: searchParams.get("status") || "",
    sort: searchParams.get("sort") || "booked",
    page,
    limit,
  };

  return useQuery({
    queryKey: ["my-tickets", params],
    queryFn: () => fetchMyTickets(params),
  });
};
