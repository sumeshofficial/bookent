import PropTypes from "prop-types";

const ImagePreview = ({ src, alt }) => {
  if (!src) return null;

  return (
    <img
      src={src}
      alt={alt}
      className="mt-2 h-20 w-auto rounded border object-cover"
    />
  );
};

ImagePreview.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
};

export default ImagePreview;