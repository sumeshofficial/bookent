import { useSearchParams } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useIsMutating,
} from "@tanstack/react-query";
import {
  fetchAdminBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../services/banner.service";
import { DEFAULT_PAGE_SIZE } from "../constants/banner.constants";

export const useBanners = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const isMutating = useIsMutating({
    mutationKey: ["admin-banners"],
  }) > 0;

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || DEFAULT_PAGE_SIZE);
  const search = searchParams.get("search") || "";
  const isActive = searchParams.get("isActive") || "all";
  const sort = searchParams.get("sort") || "createdAt_desc";

  const [sortBy, sortOrder] = sort.split("_");

  const params = {
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    ...(isActive !== "all" && { isActive: isActive === "true" }),
  };

  const bannersQuery = useQuery({
    queryKey: ["admin-banners", params],
    queryFn: () => fetchAdminBanners(params),
    keepPreviousData: true,
  });

  const createMutation = useMutation({
    mutationKey: ["admin-banners"],
    mutationFn: createBanner,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-banners"]);
    },
  });

  const updateMutation = useMutation({
    mutationKey: ["admin-banners"],
    mutationFn: updateBanner,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-banners"]);
    },
  });

  const deleteMutation = useMutation({
    mutationKey: ["admin-banners"],
    mutationFn: deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-banners"]);
    },
  });

  const updateParam = (key, value) => {
    const sp = new URLSearchParams(searchParams);

    if (!value || value === "all") {
      sp.delete(key);
    } else {
      sp.set(key, value);
    }

    sp.set("page", "1");
    setSearchParams(sp);
  };

  return {
    ...bannersQuery,

    createBanner: createMutation.mutate,
    updateBanner: updateMutation.mutate,
    deleteBanner: deleteMutation.mutate,

    isMutating,

    page,
    updateParam,
  };
};