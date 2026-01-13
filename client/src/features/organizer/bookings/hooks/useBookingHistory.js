import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import debounce from "lodash.debounce";
import { fetchEventBookings } from "../services/booking.service";

export const useBookingHistory = () => {
  const { eventSlug } = useParams();
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";
  const seatCategory = searchParams.get("seatCategory") || "";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "LATEST";

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedSearch(search);
    }, 400);

    handler();

    return () => {
      handler.cancel();
    };
  }, [search]);

  const filters = {
    page,
    limit,
    from,
    to,
    seatCategory,
    search: debouncedSearch,
    sort,
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["event-bookings", eventSlug, filters],
    queryFn: () => fetchEventBookings(eventSlug, filters),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
    enabled: !!eventSlug,
  });

  return {
    bookings: data?.data || [],
    seatCategories: data?.event?.sections,
    meta: data?.meta || null,
    loading: isLoading,
    isError,
    error,
  };
};
