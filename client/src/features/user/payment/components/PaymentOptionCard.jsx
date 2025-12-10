import { ChevronRight } from "lucide-react";

const PaymentOptionCard = ({ logo, title, onClick = null }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 border rounded-xl shadow-sm hover:bg-gray-50 transition"
    >
      <div className="flex items-center gap-3">
        <img src={logo} alt={title} className="w-6 h-6 object-contain" />
        <span className="text-base font-medium">{title}</span>
      </div>

      <ChevronRight className="w-5 h-5" />
    </button>
  );
};

export default PaymentOptionCard;