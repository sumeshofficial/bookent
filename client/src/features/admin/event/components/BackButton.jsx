import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackButton = ({ label = "Back" }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900"
    >
      <ChevronLeft className="w-4 h-4" />
      {label}
    </button>
  );
};

export default BackButton;