import { ChevronDown, ChevronRight, List, UserCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "../../services/auth";
import { logoutAdmin } from "../../Redux/adminSlice";
import toast from "react-hot-toast";

const AdminNavbar = ({
  setSidebarOpen,
}) => {
    const { admin } = useSelector(store => store.admin);
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);

  const dispatch = useDispatch();

  const adminDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        adminDropdownRef.current &&
        !adminDropdownRef.current.contains(event.target)
      ) {
        setShowAdminDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await adminLogout();
      dispatch(logoutAdmin());
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-white px-4 md:px-8 py-2 flex items-center justify-between border-b relative">
      <button
        className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
        onClick={() => setSidebarOpen(true)}
      >
        <List className="w-6 h-6" />
      </button>

      <div className="flex-1 md:hidden"></div>

      {/* Admin Profile Dropdown */}
      <div className="relative ml-auto" ref={adminDropdownRef}>
        <button
          onClick={() => setShowAdminDropdown((prev) => !prev)}
          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
            <UserCircle className="w-8 h-8 text-gray-600" />
          </div>
          <div className="hidden md:flex items-center gap-1">
            <span className="text-sm font-medium text-gray-700">Admin</span>
            {showAdminDropdown ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </div>
        </button>

        {showAdminDropdown && (
          <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 animate-fadeIn">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-800">
                Admin Profile
              </p>
              <p className="text-xs text-gray-500">{admin.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <List className="w-4 h-4 text-gray-500" />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNavbar;
