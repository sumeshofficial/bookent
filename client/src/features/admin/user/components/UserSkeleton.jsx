const UserSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-1/3 bg-gray-200 rounded" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="h-72 bg-gray-200 rounded-xl" />
        <div className="lg:col-span-2 h-72 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
};

export default UserSkeleton;
