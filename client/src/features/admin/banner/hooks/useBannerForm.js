import { useForm } from "react-hook-form";

export const useBannerForm = (initialData) => {
  return useForm({
    mode: "onChange",
    defaultValues: {
      title: initialData?.title || "",
      isActive: initialData?.isActive ?? true,
      image: initialData?.image || "",
      mobileImage: initialData?.mobileImage || "",
    },
  });
};