const TicketSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-md w-[360px] overflow-hidden animate-pulse">
      <div className="p-4 flex gap-3">
        <div className="w-16 h-16 bg-gray-300 rounded-md" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
        </div>
      </div>

      <hr className="border-dashed" />

      <div className="p-4 flex flex-col items-center gap-3">
        <div className="w-32 h-32 bg-gray-300 rounded" />
        <div className="h-4 bg-gray-300 rounded w-24" />
        <div className="h-4 bg-gray-300 rounded w-32" />
        <div className="h-3 bg-gray-200 rounded w-40" />
      </div>

      <div className="border-t p-4 flex justify-between">
        <div className="h-4 bg-gray-300 rounded w-16" />
        <div className="h-4 bg-gray-300 rounded w-20" />
      </div>
    </div>
  );
};

export default TicketSkeleton;
