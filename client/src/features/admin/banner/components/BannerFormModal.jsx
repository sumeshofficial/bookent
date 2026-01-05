import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useState } from "react";
import BannerImageInput from "./BannerImageInput";

const DESKTOP_RATIO = 1180 / 350;
const MOBILE_RATIO = 670 / 350;

const BannerFormModal = ({ onClose, onSubmit, initialData, isMutating }) => {
  const [desktopKey, setDesktopKey] = useState(0);
  const [mobileKey, setMobileKey] = useState(0);
  const [desktopPreview, setDesktopPreview] = useState(null);
  const [mobilePreview, setMobilePreview] = useState(null);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: initialData?.title || "",
      subtitle: initialData?.subtitle || "",
      order: initialData?.order || 0,
      isActive: initialData?.isActive ?? true,
    },
  });

  const submitHandler = (data) => {
    if (!initialData && !data.image?.length) {
      toast.error("Desktop banner image is required");
      return;
    }

    onSubmit({
      ...data,
      order: Number(data.order),
      image: data.image?.[0] || null,
      mobileImage: data.mobileImage?.[0] || null,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="p-3"
      aria-busy={isMutating}
    >
      <h2 className="text-lg font-semibold mb-4">
        {initialData ? "Edit Banner" : "Create Banner"}
      </h2>

      <input
        className="border w-full mb-2 p-2 disabled:opacity-60"
        placeholder="Title"
        disabled={isMutating}
        {...register("title", { required: "Title is required", maxLength: 100 })}
      />
      {errors.title && (
        <p className="text-red-500 text-xs mb-2">{errors.title.message}</p>
      )}

      <input
        className="border w-full mb-2 p-2"
        placeholder="Subtitle"
        {...register("subtitle", { maxLength: 200 })}
      />

      <input
        type="number"
        className="border w-full mb-3 p-2"
        placeholder="Order"
        {...register("order", { valueAsNumber: true, min: 0 })}
      />

      <label className="flex items-center gap-2 mb-3">
        <input type="checkbox" {...register("isActive")} />
        <span>Active</span>
      </label>

      <BannerImageInput
        label="Banner Image (Desktop)"
        name="image"
        ratio={DESKTOP_RATIO}
        register={register}
        error={errors.image}
        required
        initialData={initialData}
        inputKey={desktopKey}
        bumpKey={() => setDesktopKey((k) => k + 1)}
        preview={desktopPreview}
        setPreview={setDesktopPreview}
        setError={setError}
        clearErrors={clearErrors}
        setValue={setValue}
        disabled={isMutating}
      />

      <BannerImageInput
        label="Banner Image (Mobile)"
        name="mobileImage"
        ratio={MOBILE_RATIO}
        register={register}
        error={errors.mobileImage}
        inputKey={mobileKey}
        bumpKey={() => setMobileKey((k) => k + 1)}
        preview={mobilePreview}
        setPreview={setMobilePreview}
        setError={setError}
        clearErrors={clearErrors}
        setValue={setValue}
        disabled={isMutating}
      />

      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="px-3 py-1 border disabled:opacity-50"
          onClick={onClose}
          disabled={isMutating}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-4 py-1 bg-black text-white disabled:opacity-50"
          disabled={isMutating}
        >
          {isMutating ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};

export default BannerFormModal;