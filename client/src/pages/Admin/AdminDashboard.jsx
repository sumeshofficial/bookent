import {
  Users,
  Calendar,
  DollarSign,
  Clock,
  ChevronDown,
  MoreVertical,
} from "lucide-react";

export default function AdminDashboard() {

  const stats = [
    {
      label: "Total Customers",
      value: "5,423",
      change: "16% this month",
      icon: Users,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Event Bookings",
      value: "1,893",
      icon: Calendar,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Total Sales",
      value: "₹65,805",
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Total Events",
      value: "2800",
      icon: Clock,
      color: "bg-green-100 text-green-600",
    },
  ];

  const activityData = [
    { month: "JAN", value: 120 },
    { month: "FEB", value: 180 },
    { month: "MAR", value: 150 },
    { month: "APR", value: 260 },
    { month: "MAY", value: 300 },
    { month: "JUN", value: 220 },
    { month: "JUL", value: 250 },
    { month: "AUG", value: 100 },
    { month: "SEP", value: 280 },
    { month: "OCT", value: 370 },
    { month: "NOV", value: 390 },
    { month: "DEC", value: 420 },
  ];

  const maxValue = Math.max(...activityData.map((d) => d.value));

  return (
    <div className="flex-1 p-4 md:p-8 overflow-auto">
      {/* Dashboard Header */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-6 h-6 border-2 border-black rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-black rounded-full"></div>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-14 h-14 ${stat.color} rounded-full flex items-center justify-center`}
                >
                  <IconComponent className="w-7 h-7" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-800 mb-1">
                {stat.value}
              </p>
              {stat.change && (
                <p className="text-sm text-green-600 font-medium">
                  {stat.change}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Sales Details Section */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Sales Details</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Progress Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">
                Sales Progress
              </h3>
              <p className="text-sm text-gray-500">This Quarter</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          {/* Circular Progress */}
          <div className="flex justify-center mb-6">
            <div className="relative w-44 h-44">
              <svg className="transform -rotate-90 w-44 h-44">
                <circle
                  cx="88"
                  cy="88"
                  r="75"
                  stroke="#f3f4f6"
                  strokeWidth="16"
                  fill="none"
                />
                <circle
                  cx="88"
                  cy="88"
                  r="75"
                  stroke="#6366f1"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray="471"
                  strokeDashoffset="115"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">75.55%</span>
                <span className="text-sm text-green-600 font-semibold">
                  +10%
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm text-center text-gray-600 mb-6 px-2">
            You earned ₹28,963 today — higher than yesterday!
          </p>

          <div className="flex justify-between text-center border-t pt-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Target</p>
              <p className="font-bold text-gray-800">
                ₹30k <span className="text-red-500 text-sm">↓</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Revenue</p>
              <p className="font-bold text-gray-800">
                ₹16k <span className="text-green-500 text-sm">↑</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Today</p>
              <p className="font-bold text-gray-800">
                ₹28k <span className="text-green-500 text-sm">↑</span>
              </p>
            </div>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-800 text-lg">Activity</h3>
            <div className="relative">
              <select className="text-sm border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none pr-10">
                <option>Month</option>
                <option>Week</option>
                <option>Year</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Responsive scrollable month bars */}
          {/* Responsive scrollable month bars */}
          <div className="overflow-x-auto lg:overflow-x-visible">
            <div className="flex items-end gap-2 h-72 min-w-max lg:min-w-0 lg:justify-between">
              {activityData.map((data, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center flex-1 lg:flex-none"
                >
                  <div className="w-6 lg:w-full bg-gray-100 rounded-t-lg relative">
                    <div
                      className="w-full bg-blue-500 rounded-t-lg absolute bottom-0 transition-all hover:bg-blue-600"
                      style={{
                        height: `${(data.value / maxValue) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 mt-2 font-medium">
                    {data.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
