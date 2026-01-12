const SkeletonCard = () => (
  <div className="p-4 space-y-3 bg-white rounded-lg shadow-sm animate-pulse">
    <div className="flex justify-between">
      <div className="h-4 w-24 bg-gray-200 rounded" />
      <div className="h-4 w-10 bg-gray-200 rounded" />
    </div>

    <div className="space-y-2">
      <div className="h-3 w-full bg-gray-200 rounded" />
      <div className="h-3 w-2/3 bg-gray-200 rounded" />
    </div>

    <div className="flex justify-between pt-2">
      <div className="h-8 w-20 bg-gray-200 rounded" />
      <div className="h-8 w-20 bg-gray-200 rounded" />
      <div className="h-8 w-20 bg-gray-200 rounded" />
    </div>
  </div>
);

const CouponMobileSkeleton = () => {
  return (
    <div className="md:hidden space-y-3 p-3">
      {[...Array(3)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export default CouponMobileSkeleton;
