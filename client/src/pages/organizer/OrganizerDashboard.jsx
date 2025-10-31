import { useState } from "react";
import { Clock, DollarSign, List, Users, Menu, UserCircle2Icon } from "lucide-react";

const OrganizerDashboard = () => {
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    {
      label: "Total Booking",
      value: "5,423",
      change: "16% this month",
      icon: Users,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Total Event",
      value: "150",
      icon: List,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Total Earnings",
      value: "₹65,805",
      icon: DollarSign,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Total Pendings",
      value: "₹15,805",
      icon: Clock,
      color: "bg-red-100 text-red-600",
    },
  ];

  const activityData = [
    { month: "JAN", value: 80 },
    { month: "FEB", value: 120 },
    { month: "MAR", value: 150 },
    { month: "APR", value: 220 },
    { month: "MAY", value: 280 },
    { month: "JUN", value: 200 },
    { month: "JUL", value: 250 },
    { month: "AUG", value: 100 },
    { month: "SEP", value: 300 },
    { month: "OCT", value: 350 },
    { month: "NOV", value: 380 },
    { month: "DEC", value: 420 },
  ];

  const maxValue = Math.max(...activityData.map((d) => d.value));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-screen md:h-auto w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 shadow-lg md:shadow-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between md:justify-center p-4 border-b border-gray-200">
          <h1 className="text-lg font-bold text-violet-600">Organizer Panel</h1>
          <button
            className="md:hidden p-2"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        <nav className="flex flex-col gap-2 p-4 overflow-y-auto">
          {["Dashboard", "Events", "Sales"].map((menu) => (
            <div
              key={menu}
              onClick={() => {
                setSelectedMenu(menu);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                selectedMenu === menu
                  ? "bg-violet-100 text-violet-700"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              {menu === "Dashboard" && <Users className="w-5 h-5" />}
              {menu === "Events" && <List className="w-5 h-5" />}
              {menu === "Sales" && <DollarSign className="w-5 h-5" />}
              <span className="font-medium">{menu}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Section */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <div className="flex items-center justify-between bg-white shadow-sm p-4 md:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-lg bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-gray-700">
              {selectedMenu}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <UserCircle2Icon className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-4 md:p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-xl p-4 sm:p-6 shadow-sm flex flex-col justify-between transition-transform hover:scale-[1.02]"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.color} rounded-full flex items-center justify-center`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800 mb-1">
                    {stat.value}
                  </p>
                  {stat.change && (
                    <p className="text-xs text-green-600 font-medium">
                      {stat.change}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sales Section */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
            Sales Details
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Progress */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800 text-base">
                    Sales Progress
                  </h3>
                  <p className="text-xs text-gray-500">This Quarter</p>
                </div>
              </div>

              {/* Circular Chart */}
              <div className="flex justify-center mb-6">
                <div className="relative w-36 h-36">
                  <svg className="transform -rotate-90 w-full h-full">
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      stroke="#e5e7eb"
                      strokeWidth="10"
                      fill="none"
                    />
                    <circle
                      cx="72"
                      cy="72"
                      r="60"
                      stroke="#6366f1"
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray="377"
                      strokeDashoffset="94"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg sm:text-xl font-bold text-gray-800">
                      75.5%
                    </span>
                    <span className="text-xs text-green-600 font-medium">
                      +10%
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-center text-gray-600 mb-6 px-2">
                You earned ₹28,963 today, higher than yesterday
              </p>

              <div className="flex justify-around text-center border-t pt-4 text-xs sm:text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Target</p>
                  <p className="font-semibold text-gray-800">
                    ₹30k <span className="text-red-500">↓</span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Revenue</p>
                  <p className="font-semibold text-gray-800">
                    ₹16k <span className="text-green-500">↑</span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Today</p>
                  <p className="font-semibold text-gray-800">
                    ₹28k <span className="text-green-500">↑</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Activity Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 text-base">
                  Activity
                </h3>
                <select className="text-xs sm:text-sm border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 outline-none focus:ring-2 focus:ring-violet-500">
                  <option>Month</option>
                  <option>Week</option>
                  <option>Year</option>
                </select>
              </div>

              {/* Bar Chart */}
              <div className="flex items-end justify-between h-48 sm:h-64 gap-1 sm:gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
                {activityData.map((data, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1 min-w-[24px]"
                  >
                    <div className="w-full bg-gray-100 rounded-t-lg relative h-full">
                      <div
                        className="w-full bg-violet-500 rounded-t-lg absolute bottom-0 transition-all hover:bg-violet-600"
                        style={{ height: `${(data.value / maxValue) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-500 mt-1 sm:mt-2">
                      {data.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
