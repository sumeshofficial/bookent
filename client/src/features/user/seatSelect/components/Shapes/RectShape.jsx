const RectShape = ({
  shape,
  isDisabled,
  isSelected,
  selectedShape,
  setSelectedShape,
}) => {
  return (
    <g
      onClick={() => !isDisabled && setSelectedShape(shape)}
      style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
    >
      <rect
        x={shape.x}
        y={shape.y}
        width={shape.width}
        height={shape.height}
        rx={6}
        ry={6}
        fill={
          isDisabled
            ? "#d1d5db"
            : !selectedShape
            ? shape.fillColor
            : isSelected
            ? shape.fillColor
            : "#d1d5db"
        }
        fillOpacity={0.7}
      />

      <text
        x={shape.x + shape.width / 2}
        y={shape.y + shape.height / 2 - 6}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="13"
        fill="#000"
        pointerEvents="none"
      >
        <tspan x={shape.x + shape.width / 2} dy="0">
          {shape.title}
        </tspan>
      </text>

      {isDisabled && (
        <text
          x={shape.x + shape.width - 4}
          y={shape.y + 14}
          textAnchor="end"
          fontSize="12"
          fill="red"
          fontWeight="bold"
          pointerEvents="none"
        >
          SOLD
        </text>
      )}
    </g>
  );
};

export default RectShape;
