import { ArrowDown, ArrowUp, Eye, EyeOff, Trash } from "lucide-react";

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
            <div className="flex flex-col gap-2">
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
                className="border rounded p-1 text-xs"
                placeholder="Section Title"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Layers;
