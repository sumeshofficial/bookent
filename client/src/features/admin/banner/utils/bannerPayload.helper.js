export const buildBannerPayload = ({
  data,
  dirtyFields,
  isEdit,
  initialData,
}) => {
  let payload = {};

  if (isEdit) {
    payload.id = initialData._id;

    Object.keys(dirtyFields).forEach((key) => {
      if (key !== "image" && key !== "mobileImage") {
        payload[key] = data[key];
      }
    });

    if (data.image instanceof FileList && data.image.length > 0) {
      payload.image = data.image[0];
    }

    if (data.mobileImage instanceof FileList && data.mobileImage.length > 0) {
      payload.mobileImage = data.mobileImage[0];
    }
  } else {
    payload = {
      ...data,
      image: data.image?.[0] || null,
      mobileImage: data.mobileImage?.[0] || null,
    };
  }

  return payload;
};
