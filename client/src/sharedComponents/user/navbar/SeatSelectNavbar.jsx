import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BookentLogo from "../../BookentLogo";

const SeatSelectNavbar = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white shadow-md select-none">
      <div className="relative flex items-center px-4 py-5">
        <div className="flex items-center gap-2 mx-auto">
          <button onClick={() => navigate("/")}>
            <ChevronLeft size={26} className="text-gray-700" />
          </button>
          <h1 className="text-base lg:text-lg font-semibold text-center truncate max-w-[140px] sm:max-w-full">
            {title}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectNavbar;
