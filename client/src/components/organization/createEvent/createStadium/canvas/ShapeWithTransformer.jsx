import { useEffect, useRef } from "react";
import {
  Circle,
  Rect,
  Transformer,
  Image as KonvaImage,
  Text,
  Group,
} from "react-konva";

const ShapeWithTransformer = ({
  shape,
  isSelected,
  onSelect,
  onDragEnd,
  isDraggable,
}) => {
  const groupRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current && groupRef.current) {
      trRef.current.nodes([groupRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const renderText = () => {
    if (shape.type === "image") return null;

    const textContent = shape.title;

    if (shape.type === "rect") {
      return (
        <Text
          text={textContent}
          fontSize={14}
          fill="#000"
          align="center"
          verticalAlign="middle"
          wrap="word"
          listening={false}
          x={0}
          y={0}
          width={shape.width}
          height={shape.height}
        />
      );
    } else if (shape.type === "circle") {
      const diameter = shape.radius * 2;
      return (
        <Text
          text={textContent}
          fontSize={14}
          fill="#000"
          align="center"
          verticalAlign="middle"
          wrap="word"
          listening={false}
          x={-shape.radius}
          y={-shape.radius * 0.65}
          width={diameter}
          height={shape.radius * 1.3}
        />
      );
    }
  };

  return (
    <>
      <Group
        ref={groupRef}
        x={shape.x}
        y={shape.y}
        draggable={isDraggable}
        onClick={(e) => {
          e.cancelBubble = true;
          onSelect(e);
        }}
        onTap={onSelect}
        onDragEnd={(e) => onDragEnd(shape.id, e)}
        rotation={shape.rotation || 0}
      >
        {shape.type === "rect" && (
          <Rect
            width={shape.width}
            height={shape.height}
            fill={shape.fillColor}
            fillOpacity={shape.fillOpacity}
            stroke={isSelected ? "#6C63FF" : null}
            strokeWidth={isSelected ? 1 : 0}
            cornerRadius={3}
          />
        )}

        {shape.type === "circle" && (
          <Circle
            radius={shape.radius}
            fill={shape.fillColor}
            fillOpacity={shape.fillOpacity}
            stroke={isSelected ? "#6C63FF" : null}
            strokeWidth={isSelected ? 1 : 0}
          />
        )}

        {shape.type === "image" && shape.image && (
          <KonvaImage
            image={shape.imageurl}
            width={shape.width}
            height={shape.height}
          />
        )}

        {renderText()}
      </Group>

      {isSelected && (
        <Transformer
          ref={trRef}
          keepRatio={false}
          anchorSize={6}
          borderDash={[4, 4]}
          borderStroke="#6C63FF"
          anchorStroke="#6C63FF"
          anchorFill="#6C63FF"
          padding={0}
          boundBoxFunc={(_, newBox) => newBox}
        />
      )}
    </>
  );
};

export default ShapeWithTransformer;
