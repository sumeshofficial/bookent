const DashboardSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-24 bg-gray-200 rounded-xl" />
      ))}
    </div>

    <div className="h-72 bg-gray-200 rounded-xl" />
    <div className="h-80 bg-gray-200 rounded-xl" />
  </div>
);

export default DashboardSkeleton;
