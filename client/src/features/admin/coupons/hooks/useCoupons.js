import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { useSearchParams } from "react-router-dom";
import { fetchCoupons } from "../services/coupon.service";

export const useCoupons = () => {
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page") || 1);
  const q = searchParams.get("q") || "";
  const status = searchParams.get("status") || "ALL";
  const type = searchParams.get("type") || "ALL";
  const date = searchParams.get("date") || "ALL";
  const sort = searchParams.get("sort") || "NEWEST";
  const from = searchParams.get("from") || "";
  const to = searchParams.get("to") || "";

  const [debouncedQ, setDebouncedQ] = useState(q);

  const debouncedSetQ = useMemo(
    () =>
      debounce((value) => {
        setDebouncedQ(value);
      }, 400),
    []
  );

  useEffect(() => {
    debouncedSetQ(q);
    return () => debouncedSetQ.cancel();
  }, [q, debouncedSetQ]);

  const {
    data,
    isLoading: loading,
    isError,
    error,
  } = useQuery({
    queryKey: ["coupons", { page, q: debouncedQ, status, type, date, sort, from, to }],
    queryFn: () =>
      fetchCoupons({
        page,
        q: debouncedQ,
        status,
        type,
        date,
        sort,
        from,
        to,
      }),
    keepPreviousData: true,
    staleTime: 1000 * 60,
  });

  return {
    coupons: data?.coupons || [],
    meta: data?.meta,
    loading,
    isError,
    error,
  };
};
