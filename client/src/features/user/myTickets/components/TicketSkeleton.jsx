const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-300 rounded ${className}`} />
);

const TicketSkeleton = () => {
  return (
    <div className="flex justify-center px-3">
      <div className="bg-white rounded-2xl w-full max-w-md sm:max-w-5xl p-4 sm:p-6">
        <div className="flex gap-4">
          <Skeleton className="w-24 h-32 sm:w-40" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
};

export default TicketSkeleton;