const CircleShape = ({
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
      <circle
        cx={shape.x}
        cy={shape.y}
        r={shape.radius}
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
        x={shape.x}
        y={shape.y - 6}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="13"
        fill="#000"
        pointerEvents="none"
      >
        <tspan x={shape.x} dy="0">
          {shape.title}
        </tspan>
      </text>

      {isDisabled && (
        <text
          x={shape.x + shape.radius - 4}
          y={shape.y - shape.radius + 14}
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

export default CircleShape;
