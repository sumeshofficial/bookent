const ImageShape = ({ shape }) => {
  return (
    <g>
      <defs>
        <clipPath id={`clip-${shape.id}`}>
          <rect
            x={shape.x}
            y={shape.y}
            width={shape.width}
            height={shape.height}
            rx={8}
            ry={8}
          />
        </clipPath>
      </defs>

      <image
        href={shape.imageUrl}
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        preserveAspectRatio="none"
        transform={`rotate(${shape.rotation || 0}, ${shape.x}, ${shape.y})`}
        style={{ pointerEvents: "none" }}
        clipPath={`url(#clip-${shape.id})`}
      />
    </g>
  );
};

export default ImageShape;
