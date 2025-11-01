import {
  ChevronDown,
  ChevronRight,
  CreditCard,
  Grid,
  List,
  Package,
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/bookent-logo-black.png";

const OrganizerSidebar = ({ setSidebarOpen, sidebarOpen }) => {
  const [showEventsDropdown, setShowEventsDropdown] = useState(false);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Grid,
      path: "/listmyshow/dashboard",
    },
    { id: "events", label: "Events", icon: Package, hasDropdown: true },
    { id: "orderList", label: "Order List", icon: List, path: "/listmyshow/orders" },
    { id: "sales", label: "Sales", icon: CreditCard, path: "/listmyshow/sales" },
  ];

  return (
    <div>
      <div
        className={`fixed md:static inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-50 w-64 bg-white border-r border-gray-200`}
      >
        <div className="px-6 py-4 sm:py-3 border-b">
          <div className="flex items-center gap-2">
            <Link to='/' className="flex items-center space-x-3">
              <img
                src={logo}
                alt="Bookent"
                className="h-12 sm:h-12 w-auto object-contain"
              />
            </Link>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          {menuItems.map((item) => {
            const IconComponent = item.icon;

            return (
              <div key={item.id}>
                {item.hasDropdown ? (
                  <div
                    onClick={() => setShowEventsDropdown(!showEventsDropdown)}
                    className="flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer mb-1 text-gray-700 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {showEventsDropdown ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
                ) : (
                  <NavLink
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer mb-1 ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                  </NavLink>
                )}

                {item.id === "events" && showEventsDropdown && (
                  <div className="ml-12 space-y-1 mb-2">
                    <NavLink
                      to="/listmyshow/events"
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm rounded-lg cursor-pointer ${
                          isActive
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-600 hover:bg-gray-50"
                        }`
                      }
                    >
                      All Events
                    </NavLink>
                    <NavLink
                      to="/listmyshow/create-event"
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm rounded-lg cursor-pointer ${
                          isActive
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-600 hover:bg-gray-50"
                        }`
                      }
                    >
                      Create Events
                    </NavLink>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-transparent z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default OrganizerSidebar;
