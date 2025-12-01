import { useEffect, useRef } from "react";
import {
  Circle,
  Rect,
  Transformer,
  Image as KonvaImage,
  Text,
  Group,
  Shape,
} from "react-konva";
import useImage from "use-image";

const ShapeWithTransformer = ({
  shape,
  isSelected,
  onSelect,
  onDragEnd,
  isDraggable,
  onResize,
}) => {
  const groupRef = useRef();
  const trRef = useRef();
  const boundingRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current && groupRef.current) {
      trRef.current.nodes([groupRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const handleTransformEnd = () => {
    const node = groupRef.current;
    if (!node) return;

    const scaleX = node.scaleX() || 1;
    const scaleY = node.scaleY() || 1;

    const updates = {
      x: node.x(),
      y: node.y(),
      rotation: node.rotation(),
      offsetX: node.offsetX(),
      offsetY: node.offsetY(),
    };

    if (shape.type === "rect" || shape.type === "image") {
      const rectWidth = (boundingRef.current?.width() || 0) * scaleX;
      const rectHeight = (boundingRef.current?.height() || 0) * scaleY;
      updates.width = Math.max(1, rectWidth);
      updates.height = Math.max(1, rectHeight);
    }

    if (shape.type === "circle") {
      const diameter = (boundingRef.current?.width() || 0) * scaleX;
      updates.radius = Math.max(1, diameter / 2);
    }

    if (shape.type === "arc") {
      const currentOuterX = shape.outerRadiusX || shape.outerRadius || 100;
      const currentOuterY = shape.outerRadiusY || shape.outerRadius || 100;
      const currentInnerX = shape.innerRadiusX || shape.innerRadius || 60;
      const currentInnerY = shape.innerRadiusY || shape.innerRadius || 60;

      const newOuterRadiusX = Math.max(10, Math.round(currentOuterX * scaleX));
      const newOuterRadiusY = Math.max(10, Math.round(currentOuterY * scaleY));
      const newInnerRadiusX = Math.max(5, Math.round(currentInnerX * scaleX));
      const newInnerRadiusY = Math.max(5, Math.round(currentInnerY * scaleY));

      const newAngle = Math.max(10, Math.round((shape.angle || 60) * scaleX));

      updates.outerRadiusX = newOuterRadiusX;
      updates.outerRadiusY = newOuterRadiusY;
      updates.innerRadiusX = Math.min(newOuterRadiusX - 2, newInnerRadiusX);
      updates.innerRadiusY = Math.min(newOuterRadiusY - 2, newInnerRadiusY);
      updates.angle = Math.min(360, newAngle);

      updates.outerRadius = newOuterRadiusX;
      updates.innerRadius = newInnerRadiusX;
    }

    node.scaleX(1);
    node.scaleY(1);

    onResize(shape.id, updates);

    requestAnimationFrame(() => {
      if (trRef.current && groupRef.current) {
        trRef.current.nodes([groupRef.current]);
        trRef.current.getLayer()?.batchDraw();
      }
    });
  };

  const [img] = useImage(shape?.imageUrl, "anonymous");

  const renderText = () => {
    if (shape.type === "image") return null;

    const textContent = `${shape.title || ""}${
      shape.capacity ? " / " + shape.capacity : ""
    }`;

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
          width={Math.max(0, shape.width)}
          height={Math.max(0, shape.height)}
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
    } else {
      return null;
    }
  };

  const renderCurvedText = () => {
    if (shape.type !== "arc") return null;

    const title = shape.title || "";
    const capacity = shape.capacity ? `/${shape.capacity}` : "";
    const full = `${title}${capacity}`.trim();
    if (!full) return null;

    const chars = full.split("");

    // support elliptical arcs with separate inner/outer X/Y radii and startAngle
    const irx = shape.innerRadiusX || shape.innerRadius || 40;
    const iry = shape.innerRadiusY || shape.innerRadius || irx;
    const orx = shape.outerRadiusX || shape.outerRadius || 80;
    const ory = shape.outerRadiusY || shape.outerRadius || orx;

    const midRadiusX = irx + (orx - irx) * 0.5;
    const midRadiusY = iry + (ory - iry) * 0.5;

    const sweep = shape.angle || 40;
    const charCount = chars.length;

    const usableAngle = sweep * 0.85;
    const step = usableAngle / Math.max(1, charCount - 1);

    const startAngle = typeof shape.startAngle === "number" ? shape.startAngle : -sweep / 2;

    return chars.map((ch, i) => {
      const angleLocal = startAngle + i * step;
      const rad = (angleLocal * Math.PI) / 180;

      const x = midRadiusX * Math.cos(rad);
      const y = midRadiusY * Math.sin(rad);

      return (
        <Text
          key={i}
          text={ch}
          x={x}
          y={y}
          fontSize={10}
          wrap="word"
          fill="#000"
          rotation={angleLocal + 90}
          listening={false}
          offsetX={4}
          offsetY={7}
        />
      );
    });
  };

  return (
    <>
      <Group
        ref={groupRef}
        x={shape.x}
        y={shape.y}
        offsetX={shape.offsetX || 0}
        offsetY={shape.offsetY || 0}
        draggable={isDraggable}
        onClick={(e) => {
          e.cancelBubble = true;
          onSelect(e);
        }}
        onTap={onSelect}
        onDragEnd={(e) => onDragEnd(shape.id, e)}
        rotation={shape.rotation || 0}
        onTransformEnd={handleTransformEnd}
      >
        {shape.type === "arc" && (
          <Rect
            ref={boundingRef}
            x={-(shape.outerRadiusX || shape.outerRadius || 100)}
            y={-(shape.outerRadiusY || shape.outerRadius || 100)}
            width={(shape.outerRadiusX || shape.outerRadius || 100) * 2}
            height={(shape.outerRadiusY || shape.outerRadius || 100) * 2}
            fill="transparent"
            listening={true}
          />
        )}

        {shape.type === "rect" && (
          <>
            <Rect
              ref={boundingRef}
              width={shape.width}
              height={shape.height}
              fill={shape.fillColor}
              fillOpacity={shape.fillOpacity}
              stroke={isSelected ? "#6C63FF" : null}
              strokeWidth={isSelected ? 1 : 0}
              cornerRadius={3}
            />
          </>
        )}

        {shape.type === "circle" && (
          <Circle
            ref={boundingRef}
            radius={shape.radius}
            fill={shape.fillColor}
            fillOpacity={shape.fillOpacity}
            stroke={isSelected ? "#6C63FF" : null}
            strokeWidth={isSelected ? 1 : 0}
          />
        )}

        {shape.type === "image" && shape.imageUrl && (
          <KonvaImage
            ref={boundingRef}
            image={img}
            width={shape.width}
            height={shape.height}
          />
        )}

        {shape.type === "arc" && (
          <>
            <Shape
              sceneFunc={(context, shapeNode) => {
                const orx = shape.outerRadiusX || shape.outerRadius || 100;
                const ory = shape.outerRadiusY || shape.outerRadius || orx;
                const irx = shape.innerRadiusX || shape.innerRadius || Math.max(5, Math.round(orx * 0.6));
                const iry = shape.innerRadiusY || shape.innerRadius || Math.max(5, Math.round(ory * 0.6));

                const sweepDeg = shape.angle || 90;
                const startDeg = typeof shape.startAngle === "number" ? shape.startAngle : -sweepDeg / 2;
                const start = (startDeg * Math.PI) / 180;
                const end = start + (sweepDeg * Math.PI) / 180;

                // mid radii (used to compute cap normal)
                const midRx = irx + (orx - irx) * 0.5;
                const midRy = iry + (ory - iry) * 0.5;

                // helper: intersect line p = p0 + u * d with ellipse x^2/A^2 + y^2/B^2 = 1
                const solveLineEllipse = (p0x, p0y, dx, dy, A, B) => {
                  const a = (dx * dx) / (A * A) + (dy * dy) / (B * B);
                  const b = (2 * p0x * dx) / (A * A) + (2 * p0y * dy) / (B * B);
                  const c = (p0x * p0x) / (A * A) + (p0y * p0y) / (B * B) - 1;
                  const disc = b * b - 4 * a * c;
                  if (disc < 0 || Math.abs(a) < 1e-8) return null;
                  const sqrtD = Math.sqrt(Math.max(0, disc));
                  const u1 = (-b + sqrtD) / (2 * a);
                  const u2 = (-b - sqrtD) / (2 * a);
                  return [u1, u2];
                };

                const capIntersections = (t) => {
                  const px = midRx * Math.cos(t);
                  const py = midRy * Math.sin(t);
                  const nx = Math.cos(t) / (midRx || 1);
                  const ny = Math.sin(t) / (midRy || 1);
                  const solsOuter = solveLineEllipse(px, py, nx, ny, orx, ory);
                  const solsInner = solveLineEllipse(px, py, nx, ny, irx, iry);
                  if (!solsOuter || !solsInner) {
                    const outerX = orx * Math.cos(t);
                    const outerY = ory * Math.sin(t);
                    const innerX = irx * Math.cos(t);
                    const innerY = iry * Math.sin(t);
                    return { outer: { x: outerX, y: outerY }, inner: { x: innerX, y: innerY } };
                  }
                  const uOuter = Math.abs(solsOuter[0]) > Math.abs(solsOuter[1]) ? solsOuter[0] : solsOuter[1];
                  const uInner = Math.abs(solsInner[0]) > Math.abs(solsInner[1]) ? solsInner[0] : solsInner[1];
                  const outerX = px + uOuter * nx;
                  const outerY = py + uOuter * ny;
                  const innerX = px + uInner * nx;
                  const innerY = py + uInner * ny;
                  return { outer: { x: outerX, y: outerY }, inner: { x: innerX, y: innerY } };
                };

                const capStart = capIntersections(start);
                const capEnd = capIntersections(end);

                // Draw open band as a stroked centerline ellipse (no filled end faces)
                const thicknessX = Math.max(1, Math.abs(orx - irx));
                const thicknessY = Math.max(1, Math.abs(ory - iry));
                const thickness = Math.max(2, Math.round((thicknessX + thicknessY) / 2));

                context.beginPath();
                context.globalAlpha = typeof shape.fillOpacity === "number" ? shape.fillOpacity : 1;
                context.lineWidth = thickness;
                context.lineCap = "butt"; // flat ends; minimal visible caps
                context.strokeStyle = shape.fillColor || "#ccc";
                context.ellipse(0, 0, midRx, midRy, 0, start, end, false);
                context.stroke();
                context.globalAlpha = 1;
              }}
              listening={true}
            />

            <Group listening={false}>{renderCurvedText()}</Group>
          </>
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
          onResize={onResize}
        />
      )}
    </>
  );
};

export default ShapeWithTransformer;
