import CropImage from "../CropImage";

const UploadMedia = ({ errors, watch, setValue }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-md px-4 py-6 sm:px-8 sm:py-8">
      <span className="font-semibold text-sm sm:text-2xl">Upload Media</span>

      <CropImage
        label="Banner Image"
        name="bannerImage"
        aspect={16 / 9}
        setValue={setValue}
        errors={errors}
        watch={watch}
      />

      <CropImage
        label="Thumbnail Image"
        name="thumbnailImage"
        aspect={9 / 16}
        setValue={setValue}
        errors={errors}
        watch={watch}
      />
    </div>
  );
};

export default UploadMedia;
