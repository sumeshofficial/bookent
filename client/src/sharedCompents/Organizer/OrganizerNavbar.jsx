import { List, UserCircle } from "lucide-react";

const OrganizerNavbar = ({
  setSidebarOpen,
}) => {

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
      <div className="relative ml-auto">
        <button
          className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
            <UserCircle className="w-8 h-8 text-gray-600" />
          </div>
          <div className="hidden md:flex items-center gap-1">
          </div>
        </button>
      </div>
    </div>
  );
};

export default OrganizerNavbar;
