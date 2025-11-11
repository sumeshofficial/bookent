import { ACTIONS } from "../../../../../utils/constants";
import {
  CircleIcon,
  ImagePlus,
  MousePointer,
  RectangleHorizontal,
} from "lucide-react";

const Controllers = ({
  setAction,
  action,
  updateColor,
  fillColor,
  setImageUrl,
  setImageFile,
}) => {
  return (
    <div className="flex justify-center">
      <div className="bg-white shadow-sm py-2 px-4 mt-2 sm:mt-5 flex items-center gap-3 rounded-md">
        <button
          className={`p-2 rounded-full ${
            action === ACTIONS.SELECT ? "bg-violet-300" : "hover:bg-violet-100"
          }`}
          onClick={() => setAction(ACTIONS.SELECT)}
        >
          <MousePointer className="w-5 h-5" />
        </button>
        <button
          className={`p-2 rounded-full ${
            action === ACTIONS.RECTANGLE
              ? "bg-violet-300"
              : "hover:bg-violet-100"
          }`}
          onClick={() => setAction(ACTIONS.RECTANGLE)}
        >
          <RectangleHorizontal className="w-5 h-5" />
        </button>
        <button
          className={`p-2 rounded-full ${
            action === ACTIONS.CIRCLE ? "bg-violet-300" : "hover:bg-violet-100"
          }`}
          onClick={() => setAction(ACTIONS.CIRCLE)}
        >
          <CircleIcon className="w-5 h-5" />
        </button>
        <label className="cursor-pointer">
          <ImagePlus className="w-5 h-5" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              setImageFile(e.target.files[0]);
              setImageUrl(URL.createObjectURL(e.target.files[0]));
            }}
          />
        </label>
        <input
          type="color"
          className="w-6 h-6 cursor-pointer"
          value={fillColor}
          onChange={(e) => updateColor(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Controllers;
