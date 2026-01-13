import toast from "react-hot-toast";
import { useState } from "react";
import BannerImageInput from "./BannerImageInput";
import BannerFormFields from "./BannerFormFields";
import BannerFormActions from "./BannerFormActions";
import { useBannerForm } from "../hooks/useBannerForm";
import { buildBannerPayload } from "../utils/bannerPayload.helper";

const DESKTOP_RATIO = 1180 / 350;
const MOBILE_RATIO = 670 / 350;

const BannerFormModal = ({
  onClose,
  onSubmit,
  initialData,
  isCreating,
  isEdit = false,
}) => {
  const [desktopPreview, setDesktopPreview] = useState(
    initialData?.image || null
  );
  const [mobilePreview, setMobilePreview] = useState(
    initialData?.mobileImage || null
  );

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    formState: { errors, dirtyFields },
  } = useBannerForm(initialData);

  const submitHandler = (data) => {
    if (!initialData && !data.image?.length) {
      toast.error("Desktop banner image is required");
      return;
    }

    const payload = buildBannerPayload({
      data,
      dirtyFields,
      isEdit,
      initialData,
    });

    if (isEdit && Object.keys(payload).length === 1) {
      toast.error("No changes to update");
      return;
    }

    onSubmit(payload);
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="p-3"
      aria-busy={isCreating}
    >
      <h2 className="text-lg font-semibold mb-4">
        {isEdit ? "Edit Banner" : "Create Banner"}
      </h2>

      <BannerFormFields
        register={register}
        errors={errors}
        disabled={isCreating}
      />

      <BannerImageInput
        label="Banner Image (Desktop)"
        name="image"
        ratio={DESKTOP_RATIO}
        register={register}
        error={errors.image}
        preview={desktopPreview}
        setPreview={setDesktopPreview}
        setError={setError}
        clearErrors={clearErrors}
        setValue={setValue}
        disabled={isCreating}
      />

      <BannerImageInput
        label="Banner Image (Mobile)"
        name="mobileImage"
        ratio={MOBILE_RATIO}
        register={register}
        error={errors.mobileImage}
        preview={mobilePreview}
        setPreview={setMobilePreview}
        setError={setError}
        clearErrors={clearErrors}
        setValue={setValue}
        disabled={isCreating}
      />

      <BannerFormActions onClose={onClose} isCreating={isCreating} />
    </form>
  );
};

export default BannerFormModal;
