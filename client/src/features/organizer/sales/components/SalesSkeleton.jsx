const SkeletonCell = () => (
  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
);

const SalesSkeleton = ({ rows = 6, cols = 8 }) => {
  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="grid grid-cols-8 gap-2 px-4 py-3 bg-gray-100">
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonCell key={i} />
        ))}
      </div>

      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          className="grid grid-cols-8 gap-2 px-4 py-3 border-t"
        >
          {Array.from({ length: cols }).map((_, colIdx) => (
            <SkeletonCell key={colIdx} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default SalesSkeleton;