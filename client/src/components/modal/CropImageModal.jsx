import { useState } from "react";
import Cropper from "react-easy-crop";
import PropTypes from "prop-types";

const CropImageModal = ({
  image,
  onCropDone,
  onCropCancel,
  aspectRation = 4 / 3,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [croppedArea, setCroppedArea] = useState(null);

  const onCropCompelete = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  return (
    <div className="h-[50vh] sm:h-[80vh] flex flex-col justify-between items-center">
      <div className="relative w-full h-[85%] mt-3 sm:mt-5">
        <Cropper
          image={image}
          aspect={aspectRation}
          crop={crop}
          zoom={zoom}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropCompelete}
        />
      </div>

      <div className="self-end space-x-4">
        <button
          type="button"
          className="bg-red-600 text-white sm:text-base text-[.7rem] px-2 py-1 rounded-sm"
          onClick={onCropCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="bg-violet-600 text-white sm:text-base text-[.7rem] px-2 py-1 rounded-sm"
          onClick={() => {
            onCropDone(croppedArea);
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
};

CropImageModal.propTypes = {
  image: PropTypes.string.isRequired,
  onCropDone: PropTypes.func.isRequired,
  onCropCancel: PropTypes.func.isRequired,
  aspectRation: PropTypes.number,
};

export default CropImageModal;
