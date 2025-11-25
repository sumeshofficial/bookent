import { Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useModal } from "../../utils/constants";
import toast from "react-hot-toast";

const CropImage = ({
  setValue,
  label,
  aspect = 16 / 9,
  name,
  errors,
  watch,
}) => {
  const [image, setImage] = useState("");
  const [imageAfterCrop, setImageAfterCrop] = useState("");

  const { openModal, closeModal } = useModal();
  const inputRef = useRef();

  useEffect(() => {
    const value = watch(name);

    if (!value) return;

    if (typeof value === "string" && value.startsWith("http")) {
      setImageAfterCrop(value);
      return;
    }

    if (value instanceof Blob) {
      const reader = new FileReader();
      reader.onload = () => setImageAfterCrop(reader.result);
      reader.readAsDataURL(value);
    }
  }, [name, watch]);

  useEffect(() => {
    return () => {
      setImage("");
    };
  }, []);

  const onCropDone = (imageCroppedArea) => {
    const canvas = document.createElement("canvas");
    canvas.width = imageCroppedArea.width;
    canvas.height = imageCroppedArea.height;

    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = image;

    img.onload = () => {
      ctx.drawImage(
        img,
        imageCroppedArea.x,
        imageCroppedArea.y,
        imageCroppedArea.width,
        imageCroppedArea.height,
        0,
        0,
        imageCroppedArea.width,
        imageCroppedArea.height
      );

      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      setImageAfterCrop(dataUrl);

      canvas.toBlob(
        (blob) => {
          if (blob) setValue(name, blob, { shouldDirty: true });
          setImage("");
          closeModal();
        },
        "image/jpeg",
        0.9
      );
    };
  };

  const onCropCancel = () => {
    setImage("");
    setImageAfterCrop("");
    setValue(name, null);
    if (inputRef.current) {
      inputRef.current.value = null;
    }
    closeModal();
  };

  useEffect(() => {
    if (image) {
      openModal("crop-image", {
        image,
        onCropDone,
        onCropCancel,
        aspectRation: aspect,
      });
    }

    return () => {
      setImage("");
    };
  }, [image]);

  const handleOnChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    if (file.type === "image/svg+xml") {
      toast.error("SVG format is not supported. Please use JPG or PNG.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleOnClick = () => inputRef.current.click();

  return (
    <div className="my-6">
      <label className="block text-sm sm:text-base font-semibold mb-2 text-gray-800">
        {label}
      </label>

      {imageAfterCrop ? (
        <div
          className="relative border border-gray-200 rounded-lg overflow-hidden shadow-sm mx-auto w-full sm:w-auto"
          style={{
            aspectRatio: aspect,
            maxWidth: aspect < 1 ? "200px" : "480px",
            maxHeight: aspect < 1 ? "320px" : "auto",
            width: "100%",
          }}
        >
          <img
            src={imageAfterCrop}
            alt={`${label} Preview`}
            className="w-full h-full object-cover"
          />

          <button
            type="button"
            onClick={() => {
              setImageAfterCrop("");
              setValue(name, null, { shouldDirty: false });
              if (inputRef.current) inputRef.current.value = null;
              setImage("");
            }}
            className="absolute top-2 right-2 bg-white/80 text-red-600 p-1 rounded-full shadow hover:bg-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center bg-gray-50 hover:bg-gray-100 transition-all duration-200">
            <Upload className="mx-auto text-gray-400 mb-2 w-6 h-6 sm:w-8 sm:h-8" />
            <p className="text-gray-500 text-xs sm:text-sm mb-3">
              Upload {label.toLowerCase()} (max 2MB, JPG/PNG)
            </p>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleOnChange}
              ref={inputRef}
            />

            <button
              onClick={handleOnClick}
              type="button"
              className="cursor-pointer text-[.6rem] sm:text-sm px-4 py-2 bg-violet-100 text-violet-700 font-medium rounded-md hover:bg-violet-200 transition"
            >
              Choose File
            </button>
          </div>
          {errors[name] && (
            <span className="text-red-500 text-[.5rem] sm:text-sm">
              {errors[name].message}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default CropImage;
