import { ACTIONS } from "../../../../../utils/constants";
import {
  CircleIcon,
  CornerDownLeft,
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

        <button
          className={`p-2 rounded-full ${
            action === ACTIONS.ARC ? "bg-violet-300" : "hover:bg-violet-100"
          }`}
          onClick={() => setAction(ACTIONS.ARC)}
          title="Arc (A)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 15a8 8 0 0 1 16 0" />
          </svg>
        </button>

        <label className="cursor-pointer">
          <ImagePlus className="w-5 h-5" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setImageFile(e.target.files[0]);
                setImageUrl(URL.createObjectURL(e.target.files[0]));
              }
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
