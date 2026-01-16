import { ArrowDown, ArrowUp, Eye, EyeOff, Trash } from "lucide-react";
import PropTypes from "prop-types";

const Layers = ({ setShapes, shapes, deselectAll, selectedId }) => {
  const selectedShape = shapes.find((s) => s.id === selectedId);

  const moveLayer = (id, direction) => {
    setShapes((prev) => {
      const index = prev.findIndex((shape) => shape.id === id);
      if (index < 0) return prev;
      const newShapes = [...prev];
      const swapWith = direction === "up" ? index + 1 : index - 1;
      if (swapWith < 0 || swapWith >= newShapes.length) return prev;
      [newShapes[index], newShapes[swapWith]] = [
        newShapes[swapWith],
        newShapes[index],
      ];
      return newShapes.map((s, i) => ({ ...s, zIndex: i }));
    });
  };

  const toggleVisibility = (id) => {
    setShapes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s))
    );
  };

  return (
    <div className="w-full lg:w-64 bg-white shadow-sm rounded-md p-3 h-[70vh] overflow-y-auto">
      <h3 className="text-sm font-semibold mb-3 text-gray-700">Layers</h3>
      {shapes.length === 0 && (
        <p className="text-xs text-gray-400 text-center">No layers yet</p>
      )}

      {shapes
        .slice()
        .reverse()
        .map((shape, i) => (
          <div
            key={shape.id}
            className={`flex justify-between items-center p-2 mb-2 rounded-md ${
              selectedId === shape.id
                ? "bg-violet-100"
                : "bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <span className="text-xs font-medium capitalize">
              {shape.title || `Layer ${i + 1}`}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => moveLayer(shape.id, "up")}>
                <ArrowUp size={14} />
              </button>
              <button onClick={() => moveLayer(shape.id, "down")}>
                <ArrowDown size={14} />
              </button>
              <button onClick={() => toggleVisibility(shape.id)}>
                {shape.visible ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              <button
                onClick={() => {
                  setShapes((prev) => prev.filter((s) => s.id !== shape.id));
                  deselectAll();
                }}
              >
                <Trash size={14} className="text-red-500" />
              </button>
            </div>
          </div>
        ))}

      {selectedId && (
        <div className="mt-4 p-2 border-t">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Edit Section Details
          </h4>
          {selectedShape && (
            <div className="flex flex-col gap-2 text-xs">
              <label>Section name</label>
              <input
                type="text"
                value={selectedShape.title}
                onChange={(e) =>
                  setShapes((prev) =>
                    prev.map((s, i) =>
                      s.id === selectedId
                        ? { ...s, title: e.target.value || `Section ${i}` }
                        : s
                    )
                  )
                }
                className="border rounded p-1"
                placeholder="Section Title"
              />
              {selectedShape.type !== "image" && (
                <>
                  <label>Section capacity</label>
                  <input
                    type="number"
                    value={selectedShape.capacity || ""}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (value === "") {
                        return setShapes((prev) =>
                          prev.map((s) =>
                            s.id === selectedId ? { ...s, capacity: "" } : s
                          )
                        );
                      }

                      const num = Number(value);
                      if (isNaN(num) || num <= 0) {
                        return;
                      }

                      setShapes((prev) =>
                        prev.map((s) =>
                          s.id === selectedId ? { ...s, capacity: num } : s
                        )
                      );
                    }}
                    className="border rounded p-1 text-xs"
                    placeholder="Section Capacity"
                  />
                  {selectedShape.capacity <= 0 && (
                    <p className="text-red-500 text-[10px]">
                      Capacity must be greater than 0
                    </p>
                  )}
                  {selectedShape.type === "arc" && (
                    <>
                      <h5 className="text-[11px] font-medium mt-2">
                        Arc settings
                      </h5>
                      <label>Outer Radius X</label>
                      <input
                        type="number"
                        value={
                          selectedShape.outerRadiusX ||
                          selectedShape.outerRadius ||
                          ""
                        }
                        onChange={(e) => {
                          const v = Number(e.target.value || 0);
                          setShapes((prev) =>
                            prev.map((s) =>
                              s.id === selectedId
                                ? {
                                    ...s,
                                    outerRadiusX: v,
                                    outerRadius: Math.max(
                                      v,
                                      s.outerRadius || 0
                                    ),
                                  }
                                : s
                            )
                          );
                        }}
                        className="border rounded p-1 text-xs"
                      />

                      <label>Outer Radius Y</label>
                      <input
                        type="number"
                        value={
                          selectedShape.outerRadiusY ||
                          selectedShape.outerRadius ||
                          ""
                        }
                        onChange={(e) => {
                          const v = Number(e.target.value || 0);
                          setShapes((prev) =>
                            prev.map((s) =>
                              s.id === selectedId
                                ? {
                                    ...s,
                                    outerRadiusY: v,
                                    outerRadius: Math.max(
                                      v,
                                      s.outerRadius || 0
                                    ),
                                  }
                                : s
                            )
                          );
                        }}
                        className="border rounded p-1 text-xs"
                      />

                      <label>Inner Radius X</label>
                      <input
                        type="number"
                        value={
                          selectedShape.innerRadiusX ||
                          selectedShape.innerRadius ||
                          ""
                        }
                        onChange={(e) => {
                          const v = Number(e.target.value || 0);
                          setShapes((prev) =>
                            prev.map((s) =>
                              s.id === selectedId
                                ? { ...s, innerRadiusX: v }
                                : s
                            )
                          );
                        }}
                        className="border rounded p-1 text-xs"
                      />

                      <label>Inner Radius Y</label>
                      <input
                        type="number"
                        value={
                          selectedShape.innerRadiusY ||
                          selectedShape.innerRadius ||
                          ""
                        }
                        onChange={(e) => {
                          const v = Number(e.target.value || 0);
                          setShapes((prev) =>
                            prev.map((s) =>
                              s.id === selectedId
                                ? { ...s, innerRadiusY: v }
                                : s
                            )
                          );
                        }}
                        className="border rounded p-1 text-xs"
                      />

                      <label>Angle (deg)</label>
                      <label>Thickness</label>
                      <input
                        type="number"
                        value={
                          (selectedShape.outerRadiusX ||
                            selectedShape.outerRadius ||
                            0) -
                          (selectedShape.innerRadiusX ||
                            selectedShape.innerRadius ||
                            0)
                        }
                        onChange={(e) => {
                          const v = Number(e.target.value || 0);
                          setShapes((prev) =>
                            prev.map((s) =>
                              s.id === selectedId
                                ? {
                                    ...s,
                                    innerRadiusX: Math.max(
                                      1,
                                      (s.outerRadiusX || s.outerRadius || 0) - v
                                    ),
                                    innerRadiusY: Math.max(
                                      1,
                                      (s.outerRadiusY || s.outerRadius || 0) - v
                                    ),
                                    innerRadius: Math.max(
                                      1,
                                      (s.outerRadius || 0) - v
                                    ),
                                  }
                                : s
                            )
                          );
                        }}
                        className="border rounded p-1 text-xs"
                      />
                      <input
                        type="number"
                        value={selectedShape.angle || 0}
                        onChange={(e) => {
                          const v = Number(e.target.value || 0);
                          setShapes((prev) =>
                            prev.map((s) =>
                              s.id === selectedId ? { ...s, angle: v } : s
                            )
                          );
                        }}
                        className="border rounded p-1 text-xs"
                      />

                      <label>Start Angle (deg)</label>
                      <input
                        type="number"
                        value={selectedShape.startAngle || ""}
                        onChange={(e) => {
                          const v =
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value);
                          setShapes((prev) =>
                            prev.map((s) =>
                              s.id === selectedId ? { ...s, startAngle: v } : s
                            )
                          );
                        }}
                        className="border rounded p-1 text-xs"
                        placeholder="optional"
                      />
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

Layers.propTypes = {
  setShapes: PropTypes.func.isRequired,
  shapes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string,
      type: PropTypes.string,
      visible: PropTypes.bool,
      capacity: PropTypes.number,
      zIndex: PropTypes.number,
      outerRadius: PropTypes.number,
      outerRadiusX: PropTypes.number,
      outerRadiusY: PropTypes.number,
      innerRadius: PropTypes.number,
      innerRadiusX: PropTypes.number,
      innerRadiusY: PropTypes.number,
      angle: PropTypes.number,
      startAngle: PropTypes.number,
    })
  ).isRequired,
  deselectAll: PropTypes.func.isRequired,
  selectedId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Layers;
