import { Pencil, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useModal } from "../../utils/constants";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const CropImageProfile = ({ imageUpdate, label, user }) => {
  const [image, setImage] = useState("");
  const [imageAfterCrop, setImageAfterCrop] = useState("");
  const { organizer } = useSelector((store) => store.organizer);

  const inputRef = useRef();
  const { openModal, closeModal } = useModal();

  // Crop done
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

      closeModal();
      canvas.toBlob(
        async (blob) => {
          if (blob) await imageUpdate(blob);
          setImage("");
        },
        "image/jpeg",
        0.9
      );

      setImageAfterCrop(canvas.toDataURL("image/jpeg", 0.9));
    };
  };

  const onCropCancel = () => {
    setImage("");
    closeModal();
  };

  useEffect(() => {
    if (image) {
      openModal("crop-image", {
        image,
        onCropDone,
        onCropCancel,
        aspectRation: 1,
      });
    }
  }, [image]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const openFileSelector = () => inputRef.current.click();

  return (
    <div className="my-6">
      <label className="block text-sm font-semibold mb-2 text-gray-800">
        {label}
      </label>

      <div className="relative w-32 h-32 sm:w-30 sm:h-30 mx-auto group cursor-pointer">
        <img
          src={
            imageAfterCrop || user?.profileImage || 
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="Profile"
          className="w-full h-full rounded-full object-cover border shadow"
        />

        <div
          onClick={openFileSelector}
          className="
            absolute inset-0 rounded-full bg-black/40 
            flex items-center justify-center opacity-0
            group-hover:opacity-100 transition-opacity
          "
        >
          <Pencil className="text-white w-6 h-6" />
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={inputRef}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default CropImageProfile;
