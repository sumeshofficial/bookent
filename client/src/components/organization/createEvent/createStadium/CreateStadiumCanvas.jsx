import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import Canvas from "./canvas/Canvas";
import Layers from "./canvas/Layers";
import { useEffect } from "react";

const CreateStadiumForm = ({ setValue, setCurrentPage, watch }) => {
  const [shapes, setShapes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const stageRef = useRef(null);

  useEffect(() => {
    const stadiumLayout = watch("stadiumLayout");

    if (stadiumLayout) {
      setShapes(stadiumLayout.shapes);
    }
  }, [watch("stadiumLayout")]);

  const handleSaveLayout = async () => {
    try {
      const stage = stageRef.current?.getStage();
      if (!stage) {
        toast.error("Stage not found");
        return;
      }

      const transformers = stage.find("Transformer");
      transformers.forEach((tr) => tr.visible(false));

      const selectedShapes = stage.find("Rect, Circle");
      selectedShapes.forEach((shape) => {
        if (shape.stroke() === "#6C63FF") shape.strokeEnabled(false);
      });

      const dataURL = stage.toDataURL({ pixelRatio: 2 });
      const blob = await (await fetch(dataURL)).blob();

      selectedShapes.forEach((shape) => shape.strokeEnabled(true));
      transformers.forEach((tr) => tr.visible(true));
      stage.draw();

      const layoutData = {
        shapes,
        layoutImage: blob,
      };

      setValue("stadiumLayout", layoutData);
      toast.success("Layout saved successfully");
      setCurrentPage("form");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="p-4 flex flex-col lg:flex-row gap-4">
      <div className="flex-1">
        <div className="flex justify-between mb-4">
          <button
          type="button"
            onClick={() => {
              if (shapes.length > 0) {
                const confirmLeave = window.confirm(
                  "You have unsaved shapes in your layout. Are you sure you want to leave?"
                );
                if (!confirmLeave) return;
              }
              setCurrentPage("form");
            }}
            className="flex gap-2 items-center text-violet-700 font-medium"
          >
            ← Back
          </button>

          <button
          type="button"
            onClick={handleSaveLayout}
            disabled={!shapes.length}
            className={`py-2 px-3 rounded-md text-white font-medium ${
              shapes.length
                ? "bg-violet-500 hover:bg-violet-600"
                : "bg-violet-400 cursor-not-allowed"
            }`}
          >
            Save
          </button>
        </div>

        <Canvas
          ref={stageRef}
          deselectAll={() => setSelectedId(null)}
          shapes={shapes}
          selectedId={selectedId}
          setShapes={setShapes}
          setSelectedId={setSelectedId}
        />
      </div>

      <Layers
        setShapes={setShapes}
        shapes={shapes}
        deselectAll={() => setSelectedId(null)}
        selectedId={selectedId}
      />
    </div>
  );
};

export default CreateStadiumForm;
