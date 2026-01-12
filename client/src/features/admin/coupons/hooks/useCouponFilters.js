import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const useCouponFilters = (coupons) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "ALL");
  const [type, setType] = useState(searchParams.get("type") || "ALL");
  const [date, setDate] = useState(searchParams.get("date") || "ALL");
  const [sort, setSort] = useState(searchParams.get("sort") || "NEWEST");
  const [from, setFrom] = useState(searchParams.get("from") || "");
  const [to, setTo] = useState(searchParams.get("to") || "");

  useEffect(() => {
    const params = {};

    if (search) params.q = search;
    if (status !== "ALL") params.status = status;
    if (type !== "ALL") params.type = type;
    if (date !== "ALL") params.date = date;
    if (sort !== "NEWEST") params.sort = sort;
    if (from) params.from = from;
    if (to) params.to = to;

    params.page = "1";
    setSearchParams(params, { replace: true });
  }, [search, status, type, date, sort, from, to, setSearchParams]);

  const filteredCoupons = useMemo(() => {
    let data = [...coupons];
    const now = new Date();

    if (search)
      data = data.filter(
        (c) =>
          c.code.toLowerCase().includes(search.toLowerCase()) ||
          (c.description || "").toLowerCase().includes(search.toLowerCase())
      );

    if (status !== "ALL")
      data = data.filter((c) =>
        status === "ACTIVE" ? c.isActive : !c.isActive
      );

    if (type !== "ALL") data = data.filter((c) => c.discountType === type);

    if (date === "ACTIVE")
      data = data.filter(
        (c) => new Date(c.startDate) <= now && new Date(c.expiryDate) >= now
      );
    else if (date === "UPCOMING")
      data = data.filter((c) => new Date(c.startDate) > now);
    else if (date === "EXPIRED")
      data = data.filter((c) => new Date(c.expiryDate) < now);

    if (from)
      data = data.filter((c) => new Date(c.startDate) >= new Date(from));
    if (to) data = data.filter((c) => new Date(c.expiryDate) <= new Date(to));

    if (sort === "EXPIRY")
      data.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
    else if (sort === "USAGE") data.sort((a, b) => b.usedCount - a.usedCount);
    else data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    return data;
  }, [coupons, search, status, type, date, sort, from, to]);

  return {
    filters: { search, status, type, date, sort, from, to },
    setFilters: {
      setSearch,
      setStatus,
      setType,
      setDate,
      setSort,
      setFrom,
      setTo,
    },
    filteredCoupons,
  };
};
