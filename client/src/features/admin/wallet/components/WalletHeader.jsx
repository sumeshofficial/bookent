import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { exportWalletCSV, exportWalletExcel } from "../services/adminWallet.service";

const WalletHeader = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold">Admin Wallet</h1>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="px-4 py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 flex items-center gap-2"
        >
          Export
          <ChevronDown />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-44 rounded-lg border bg-white shadow-lg z-50">
            <button
              onClick={() => {
                exportWalletCSV();
                setOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
            >
              Export as CSV
            </button>

            <button
              onClick={() => {
                exportWalletExcel();
                setOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
            >
              Export as Excel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletHeader;