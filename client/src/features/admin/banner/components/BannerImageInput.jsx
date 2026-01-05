import ImagePreview from "./ImagePreview";
import {
  MAX_IMAGE_SIZE_BYTES,
  validateImageRatio,
} from "../utils/imageValidation";


const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

const getDimensionHint = (ratio) => {
  if (!ratio) return null;

  if (Math.abs(ratio - 1180 / 350) < 0.01) {
    return "Required size: 1180 × 350 (Desktop banner)";
  }

  if (Math.abs(ratio - 670 / 350) < 0.01) {
    return "Required size: 670 × 350 (Mobile banner)";
  }

  return `Required aspect ratio: ${ratio.toFixed(2)}`;
};

const BannerImageInput = ({
  label,
  name,
  ratio,
  register,
  error,
  required = false,
  initialData,
  inputKey,
  bumpKey,
  preview,
  setPreview,
  setError,
  clearErrors,
  setValue,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm mb-1">{label}</label>

      <input
        key={inputKey}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        {...register(name)}
        onChange={async (e) => {
          const input = e.target;
          const file = input.files?.[0];

          if (!file) {
            if (required && !initialData) {
              setError(name, {
                type: "manual",
                message: `${label} is required`,
              });
            }
            return;
          }

          if (!ALLOWED_TYPES.includes(file.type)) {
            input.value = "";
            setValue(name, null);
            setError(name, { type: "manual", message: "Invalid image type" });
            bumpKey();
            setPreview(null);
            return;
          }

          if (file.size > MAX_IMAGE_SIZE_BYTES) {
            input.value = "";
            setValue(name, null);
            setError(name, {
              type: "manual",
              message: "Image size must be under 2MB",
            });
            bumpKey();
            setPreview(null);
            return;
          }

          const ratioResult = await validateImageRatio(file, ratio);
          if (ratioResult !== true) {
            input.value = "";
            setValue(name, null);
            setError(name, {
              type: "manual",
              message: ratioResult,
            });
            bumpKey();
            setPreview(null);
            return;
          }

          clearErrors(name);
          setPreview(URL.createObjectURL(file));
        }}
      />

      <p className="text-xs text-gray-500 mt-1">
        {getDimensionHint(ratio)}
      </p>

      <ImagePreview src={preview} alt={label} />

      {error && (
        <p className="text-red-500 text-xs mt-1">{error.message}</p>
      )}
    </div>
  );
};

export default BannerImageInput;