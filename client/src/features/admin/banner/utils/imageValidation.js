const MAX_IMAGE_SIZE_MB = 2;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
export const RATIO_TOLERANCE = 0.05;

export const validateImageRatio = (file, expectedRatio) =>
  new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const ratio = img.width / img.height;
      URL.revokeObjectURL(img.src);

      const isValid =
        Math.abs(ratio - expectedRatio) / expectedRatio <= RATIO_TOLERANCE;

      resolve(
        isValid ||
          `Image ratio must be approximately ${expectedRatio.toFixed(2)} (${img.width}×${img.height})`
      );
    };
  });