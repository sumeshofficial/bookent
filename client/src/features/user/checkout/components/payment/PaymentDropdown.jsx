import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const PaymentDropdown = ({ label, value, items = [] }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div
        className="flex justify-between cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center justify-center gap-2">
          <span>{label} </span>
          {open ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
        <span>₹ {value}</span>
      </div>

      {open && (
        <div className="mt-2 space-y-1 text-sm text-gray-600 border-t border-gray-200">
          {items.map((i, idx) => (
            <div key={idx} className="flex justify-between mt-2">
              <span>{i.label}</span>
              <span>₹ {i.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentDropdown;
