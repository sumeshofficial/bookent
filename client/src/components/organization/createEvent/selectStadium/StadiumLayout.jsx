import { Pencil } from "lucide-react";

const StadiumLayout = ({ setCurrentPage }) => {
  return (
    <>
      <div className="flex justify-end mt-5">
        <div className="inline-block bg-linear-to-r from-violet-500 to-violet-800 p-0.5 rounded-lg">
          <button
            onClick={() => setCurrentPage("canvas")}
            type="button"
            className="bg-white text-[.5rem] text-violet-700 font-semibold px-2 py-2 sm:px-4 sm:py-2 rounded-md hover:bg-violet-50 transition flex items-center gap-2 text-sm sm:text-base"
          >
            <Pencil className="w-3 h-3 sm:w-5 sm:h-5" />
            Create Layout
          </button>
        </div>
      </div>
    </>
  );
};

export default StadiumLayout;
