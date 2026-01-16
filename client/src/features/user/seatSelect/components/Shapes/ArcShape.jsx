import PropTypes from "prop-types";

const ArcShape = ({
  shape,
  isDisabled,
  isSelected,
  selectedShape,
  setSelectedShape,
}) => {
  const orx = shape.outerRadiusX || shape.outerRadius || 0;
  const ory = shape.outerRadiusY || shape.outerRadius || 0;
  const irx = shape.innerRadiusX || shape.innerRadius || 0;
  const iry = shape.innerRadiusY || shape.innerRadius || 0;

  const midRx = irx + (orx - irx) * 0.5;
  const midRy = iry + (ory - iry) * 0.5;

  const thickness = Math.max(2, Math.round((orx - irx + (ory - iry)) / 2));

  const angle = shape.angle ?? 180;
  const start = -angle / 2;
  const end = angle / 2;

  const largeArc = angle > 180 ? 1 : 0;

  const cx = shape.x;
  const cy = shape.y;

  const startX = cx + midRx * Math.cos((start * Math.PI) / 180);
  const startY = cy + midRy * Math.sin((start * Math.PI) / 180);
  const endX = cx + midRx * Math.cos((end * Math.PI) / 180);
  const endY = cy + midRy * Math.sin((end * Math.PI) / 180);

  const textPathD = `M ${startX} ${startY} A ${midRx} ${midRy} 0 ${largeArc} 1 ${endX} ${endY}`;

  return (
    <>
      <defs>
        <path
          id={`text-arc-${shape.id}`}
          d={textPathD}
          transform={`rotate(${shape.rotation || 0}, ${cx}, ${cy})`}
        />
      </defs>

      <g
        onClick={() => !isDisabled && setSelectedShape(shape)}
        style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
      >
        <path
          d={textPathD}
          fill="none"
          stroke={
            isDisabled
              ? "#d1d5db"
              : !selectedShape
              ? shape.fillColor
              : isSelected
              ? shape.fillColor
              : "#d1d5db"
          }
          strokeWidth={thickness}
          strokeOpacity={shape.fillOpacity ?? 0.6}
          strokeLinecap="butt"
          transform={`rotate(${shape.rotation || 0}, ${cx}, ${cy})`}
          pointerEvents="stroke"
        />

        <text
          fill="#000"
          fontSize="13"
          pointerEvents="none"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          <textPath
            href={`#text-arc-${shape.id}`}
            startOffset="50%"
            method="align"
            spacing="auto"
          >
            {shape.title}
          </textPath>
        </text>

        {isDisabled &&
          (() => {
            const targetAngle = end - 10;
            const px = cx + midRx * Math.cos((targetAngle * Math.PI) / 180);
            const py = cy + midRy * Math.sin((targetAngle * Math.PI) / 180);
            const rad = ((shape.rotation || 0) * Math.PI) / 180;
            const rotX =
              cx + (px - cx) * Math.cos(rad) - (py - cy) * Math.sin(rad);
            const rotY =
              cy + (px - cx) * Math.sin(rad) + (py - cy) * Math.cos(rad);

            return (
              <text
                x={rotX}
                y={rotY}
                textAnchor="middle"
                fontSize="12"
                fill="red"
                fontWeight="bold"
                pointerEvents="none"
              >
                SOLD
              </text>
            );
          })()}
      </g>
    </>
  );
};

ArcShape.propTypes = {
  shape: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,

    outerRadius: PropTypes.number,
    outerRadiusX: PropTypes.number,
    outerRadiusY: PropTypes.number,

    innerRadius: PropTypes.number,
    innerRadiusX: PropTypes.number,
    innerRadiusY: PropTypes.number,

    angle: PropTypes.number,
    rotation: PropTypes.number,

    fillColor: PropTypes.string.isRequired,
    fillOpacity: PropTypes.number,
  }).isRequired,

  isDisabled: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  selectedShape: PropTypes.object,
  setSelectedShape: PropTypes.func.isRequired,
};

export default ArcShape;
