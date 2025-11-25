import { Layer, Rect, Stage } from "react-konva";
import ShapeWithTransformer from "./ShapeWithTransformer";
import { ACTIONS } from "../../../../../utils/constants";
import useResizer from "../../../../../hooks/useResizer";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useRef, useState } from "react";
import Controllers from "./Controllers";
import { forwardRef } from "react";
import { useImperativeHandle } from "react";

const Canvas = forwardRef(
  ({ deselectAll, shapes, selectedId, setShapes, setSelectedId }, ref) => {
    const [imageUrl, setImageUrl] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [fillColor, setFillColor] = useState("#55E2E9");
    const [action, setAction] = useState(ACTIONS.SELECT);

    const currentShapeId = useRef(null);
    const isPainting = useRef(false);
    const stageRef = useRef();
    const containerRef = useRef();

    const arcCenterRef = useRef({ x: 0, y: 0 });
    const arcStartAngleRef = useRef(0);

    const size = useResizer(containerRef);
    const isDraggable = action === ACTIONS.SELECT;

    useImperativeHandle(ref, () => ({
      getStage: () => stageRef.current,
    }));

    useEffect(() => {
      const handleKey = (e) => {
        if (e.target.tagName === "INPUT") return;
        switch (e.key.toLowerCase()) {
          case "r":
            setAction(ACTIONS.RECTANGLE);
            break;
          case "c":
            setAction(ACTIONS.CIRCLE);
            break;
          case "a":
            setAction(ACTIONS.ARC);
            break;
          case "s":
          case "escape":
            setAction(ACTIONS.SELECT);
            break;
          case "backspace":
          case "delete":
            if (selectedId) {
              setShapes((prev) => prev.filter((s) => s.id !== selectedId));
              deselectAll();
            }
            break;
          default:
            break;
        }
      };
      window.addEventListener("keydown", handleKey);
      return () => window.removeEventListener("keydown", handleKey);
    }, [selectedId]);

    useEffect(() => {
      if (imageFile && imageUrl) {
        const localUrl = URL.createObjectURL(imageFile);
        const id = uuidv4();
        const newImage = {
          id,
          type: "image",
          x: 50,
          y: 50,
          width: 200,
          height: 200,
          visible: true,
          zIndex: shapes.length,
          imageUrl: localUrl,
          image: imageFile,
          title: imageFile.name,
        };
        setShapes((prev) => [...prev, newImage]);
        setSelectedId(id);
        setAction(ACTIONS.SELECT);
      }
    }, [imageUrl]);

    const handleCanvasPointerDown = (e) => {
      if (action === ACTIONS.SELECT) return;

      const stage = stageRef.current;
      const pos = stage.getPointerPosition();
      const id = uuidv4();
      currentShapeId.current = id;
      isPainting.current = true;

      if (action === ACTIONS.ARC) {
        arcCenterRef.current = { x: pos.x, y: pos.y };
        const startAngle =
          (Math.atan2(pos.y - pos.y, pos.x - pos.x) * 180) / Math.PI || 0;
        arcStartAngleRef.current = 0;
        const newArc = {
          id,
          type: "arc",
          x: pos.x,
          y: pos.y,
          innerRadius: 40,
          outerRadius: 70,
          innerRadiusX: 40,
          innerRadiusY: 40,
          outerRadiusX: 70,
          outerRadiusY: 70,
          angle: 60,
          rotation: -30,
          fillColor,
          fillOpacity: 0.6,
          capacity: 200,
          visible: true,
          zIndex: shapes.length,
          title: `Pavilion ${shapes.length + 1}`,
        };
        setShapes((prev) => [...prev, newArc]);
        return;
      }

      let newShape = {
        id,
        type: action === ACTIONS.RECTANGLE ? "rect" : "circle",
        x: pos.x,
        y: pos.y,
        width: 20,
        height: 20,
        radius: 20,
        fillColor,
        fillOpacity: 0.5,
        capacity: 50,
        visible: true,
        zIndex: shapes.length,
        title: `Section ${shapes.length + 1}`,
      };
      setShapes((prev) => [...prev, newShape]);
    };

    const handleResize = (id, newAttrs) => {
      setShapes((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...newAttrs } : s))
      );
    };

    const onShapeClick = (e, id) => {
      if (action !== ACTIONS.SELECT) return;
      e.cancelBubble = true;
      setSelectedId(id);
    };

    const updateColor = (color) => {
      setFillColor(color);
      if (selectedId) {
        setShapes((prev) =>
          prev.map((s) =>
            s.id === selectedId ? { ...s, fillColor: color } : s
          )
        );
      }
    };

    const SNAP_SIZE = 20;

    const snapToGrid = (value) => Math.round(value / SNAP_SIZE) * SNAP_SIZE;

    const handleDragEnd = (id, e) => {
      const node = e.target;
      const pos = node.position();
      const snapped = {
        x: snapToGrid(pos.x),
        y: snapToGrid(pos.y),
      };
      setShapes((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...snapped } : s))
      );
    };

    const handleStageDblClick = () => {
      setAction(ACTIONS.SELECT);
    };

    const handleCanvasPointerUp = () => {
      if (isPainting.current) {
        isPainting.current = false;

        setTimeout(() => {
          setSelectedId(currentShapeId.current);
        }, 20);
      }
    };

    const handleCanvasPointerMove = () => {
      if (!isPainting.current || action === ACTIONS.SELECT) return;
      const stage = stageRef.current;
      const { x, y } = stage.getPointerPosition();

      setShapes((prev) =>
        prev.map((shape) => {
          if (shape.id !== currentShapeId.current) return shape;
          if (shape.type === "rect") {
            return { ...shape, width: x - shape.x, height: y - shape.y };
          } else if (shape.type === "circle") {
            return {
              ...shape,
              radius: Math.sqrt((x - shape.x) ** 2 + (y - shape.y) ** 2),
            };
          } else if (shape.type === "arc") {
            const cx = shape.x;
            const cy = shape.y;
            const dx = x - cx;
            const dy = y - cy;

            const absDx = Math.max(10, Math.round(Math.abs(dx)));
            const absDy = Math.max(10, Math.round(Math.abs(dy)));

            const pointerAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

            let angle = Math.min(Math.max(Math.abs(pointerAngle), 10), 360);
            const rotation = pointerAngle - angle / 2;

            return {
              ...shape,
              outerRadiusX: absDx,
              outerRadiusY: absDy,
              outerRadius: Math.max(20, Math.round(Math.max(absDx, absDy))),
              innerRadiusX: Math.max(5, Math.round(absDx * 0.5)),
              innerRadiusY: Math.max(5, Math.round(absDy * 0.5)),
              innerRadius: Math.max(10, Math.round(Math.min(absDx, absDy) * 0.5)),
              angle: Math.round(angle),
              rotation: Math.round(rotation),
            };
          } else return shape;
        })
      );
    };

    return (
      <div className="bg-white shadow-sm rounded-md">
        <Controllers
          setAction={setAction}
          action={action}
          updateColor={updateColor}
          fillColor={fillColor}
          setImageUrl={setImageUrl}
          setImageFile={setImageFile}
        />

        <div
          ref={containerRef}
          className="w-full h-[70vh] mt-4 rounded-lg overflow-hidden"
        >
          <Stage
            ref={stageRef}
            width={size.width}
            height={size.height}
            onPointerDown={(e) => {
              if (e.target === e.target.getStage()) {
                deselectAll();
              } else {
                handleCanvasPointerDown(e);
              }
            }}
            onPointerMove={handleCanvasPointerMove}
            onPointerUp={handleCanvasPointerUp}
            onDblClick={handleStageDblClick}
          >
            <Layer>
              <Rect
                x={0.5}
                y={0.5}
                width={size.width - 1}
                height={size.height - 1}
                fill="#ffffff"
                stroke="#d1d5db"
                strokeWidth={2}
                cornerRadius={10}
                onClick={deselectAll}
              />
              {[...shapes]
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((shape) =>
                  shape.visible ? (
                    <ShapeWithTransformer
                      key={shape.id}
                      shape={shape}
                      isSelected={selectedId === shape.id}
                      onSelect={(e) => onShapeClick(e, shape.id)}
                      onDragEnd={handleDragEnd}
                      isDraggable={isDraggable}
                      onResize={handleResize}
                    />
                  ) : null
                )}
            </Layer>
          </Stage>
        </div>
      </div>
    );
  }
);

export default Canvas;
