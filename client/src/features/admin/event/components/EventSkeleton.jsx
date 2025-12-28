const EventSkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 w-1/3 bg-gray-200 rounded" />
      <div className="h-32 bg-gray-200 rounded" />
      <div className="h-32 bg-gray-200 rounded" />
    </div>
  );
};

export default EventSkeleton;