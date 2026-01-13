const BannerSkeleton = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 w-48 bg-gray-200 rounded" />

      <div className="h-10 bg-gray-200 rounded" />

      <div className="border rounded">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-4 gap-4 p-4 border-b last:border-b-0"
          >
            <div className="h-4 bg-gray-200 rounded col-span-1" />
            <div className="h-4 bg-gray-200 rounded col-span-1" />
            <div className="h-4 bg-gray-200 rounded col-span-1" />
            <div className="h-4 bg-gray-200 rounded col-span-1" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerSkeleton;
