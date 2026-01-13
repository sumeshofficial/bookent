import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash.debounce";
import toast from "react-hot-toast";

import { fetchUsers } from "../services/users.service";
import { USERS_QUERY_KEY } from "../constants/users.constants";

export const useUsers = (limit = 5) => {
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "newest";
  const status = searchParams.get("status") || "all";

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const debouncedSearchFn = useMemo(
    () =>
      debounce((value) => {
        setDebouncedSearch(value);
      }, 400),
    []
  );

  useEffect(() => {
    debouncedSearchFn(search);

    return () => {
      debouncedSearchFn.cancel();
    };
  }, [search, debouncedSearchFn]);

  return useQuery({
    queryKey: [USERS_QUERY_KEY, page, limit, debouncedSearch, sort, status],
    queryFn: () =>
      fetchUsers({
        page,
        limit,
        search: debouncedSearch,
        sort,
        status,
      }),
    keepPreviousData: true,
    onError: (err) => toast.error(err?.message || "Failed to fetch users"),
  });
};
