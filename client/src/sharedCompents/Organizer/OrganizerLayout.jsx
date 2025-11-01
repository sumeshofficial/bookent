import { useState } from "react";
import OrganizerNavbar from "./OrganizerNavbar";
import OrganizerSidebar from "./OrganizerSidebar";
import { Outlet } from "react-router-dom";

const OrganizerLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <OrganizerSidebar
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
      />
      <div className="flex-1 flex flex-col">
        <OrganizerNavbar setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default OrganizerLayout;
