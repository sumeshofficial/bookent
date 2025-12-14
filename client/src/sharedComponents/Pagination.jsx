import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ meta }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("page") || 1);

  const goToPage = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    setSearchParams(params, { replace: true });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (meta.totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 pt-6">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-1.5 border rounded-lg text-sm bg-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} />
        Prev
      </button>

      <span className="px-3 py-1.5 text-sm font-medium text-gray-700">
        Page {currentPage} of {meta?.totalPages}
      </span>

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === meta?.totalPages}
        className="flex items-center gap-1 px-3 py-1.5 border rounded-lg text-sm bg-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;