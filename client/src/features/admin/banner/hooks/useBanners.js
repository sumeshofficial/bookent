import { useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  uploadImages,
} from "../services/banner.service";
import { DEFAULT_PAGE_SIZE } from "../constants/banner.constants";
import toast from "react-hot-toast";
import { generateUploadUrl } from "../../../../services/s3";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useRef } from "react";

export const useBanners = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

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
    ...(isActive !== "all" && { isActive: isActive === "active" }),
  };

  const bannersQuery = useQuery({
    queryKey: ["admin-banners", params],
    queryFn: () => fetchAdminBanners(params),
    keepPreviousData: true,
  });

  const createMutation = useMutation({
    mutationFn: async (formData) => {
      const payload = { ...formData };

      if (formData.image) {
        const { key, signedUrl } = await generateUploadUrl({
          fileName: `${Date.now()}-${formData.image.name}`,
          contentType: formData.image.type,
          folderName: "banners",
        });

        await uploadImages(signedUrl, formData.image);
        payload.image = key;
      }

      if (formData.mobileImage) {
        const { key, signedUrl } = await generateUploadUrl({
          fileName: `${Date.now()}-${formData.mobileImage.name}`,
          contentType: formData.mobileImage.type,
          folderName: "banners",
        });

        await uploadImages(signedUrl, formData.mobileImage);
        payload.mobileImage = key;
      }

      return createBanner(payload);
    },
    onSuccess: () => {
      toast.success("Banner created successfully");
      queryClient.invalidateQueries(["admin-banners"]);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error?.message || error.message);
    },
  });

  const updateMutation = useMutation({
    mutationKey: ["admin-banners"],
    mutationFn: async (formData) => {
      const payload = { ...formData };

      if (formData.image) {
        const { key, signedUrl } = await generateUploadUrl({
          fileName: `${Date.now()}-${formData.image.name}`,
          contentType: formData.image.type,
          folderName: "banners",
        });

        await uploadImages(signedUrl, formData.image);
        payload.image = key;
      }

      if (formData.mobileImage) {
        const { key, signedUrl } = await generateUploadUrl({
          fileName: `${Date.now()}-${formData.mobileImage.name}`,
          contentType: formData.mobileImage.type,
          folderName: "banners",
        });

        await uploadImages(signedUrl, formData.mobileImage);
        payload.mobileImage = key;
      }

      return updateBanner(payload);
    },
    onSuccess: () => {
      toast.success("Banner updated successfully");
      queryClient.invalidateQueries(["admin-banners"]);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error?.message || error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationKey: ["admin-banners"],
    mutationFn: deleteBanner,
    onSuccess: () => {
      toast.success("Banner deleted successfully");
      queryClient.invalidateQueries(["admin-banners"]);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error.message);
    },
  });

  const debouncedUpdateRef = useRef(
    debounce((key, value, currentParams, setSearchParams) => {
      const sp = new URLSearchParams(currentParams);

      if (!value || value === "all") {
        sp.delete(key);
      } else {
        sp.set(key, value);
      }

      sp.set("page", "1");
      setSearchParams(sp);
    }, 500)
  );

  useEffect(() => {
    const debouncedFn = debouncedUpdateRef.current;

    return () => {
      debouncedFn.cancel();
    };
  }, []);

  const updateParam = useCallback(
    (key, value) => {
      if (key === "search") {
        debouncedUpdateRef.current(key, value, searchParams, setSearchParams);
      } else {
        const sp = new URLSearchParams(searchParams);

        if (!value || value === "all") {
          sp.delete(key);
        } else {
          sp.set(key, value);
        }

        sp.set("page", "1");
        setSearchParams(sp);
      }
    },
    [searchParams, setSearchParams]
  );

  return {
    ...bannersQuery,

    createBanner: createMutation.mutate,
    updateBanner: updateMutation.mutate,
    deleteBanner: deleteMutation.mutate,

    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    page,
    updateParam,
  };
};
