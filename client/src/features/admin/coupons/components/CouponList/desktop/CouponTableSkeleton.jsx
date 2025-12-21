const CouponTableSkeleton = ({ rows = 5 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="animate-pulse border-b">
          <td className="p-3">
            <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-40 bg-gray-200 rounded" />
          </td>

          <td className="p-3">
            <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-24 bg-gray-200 rounded" />
          </td>

          <td className="p-3 text-center">
            <div className="h-4 w-16 bg-gray-200 rounded mx-auto mb-2" />
            <div className="h-3 w-20 bg-gray-200 rounded mx-auto" />
          </td>

          <td className="p-3 text-center">
            <div className="h-3 w-24 bg-gray-200 rounded mx-auto mb-1" />
            <div className="h-3 w-24 bg-gray-200 rounded mx-auto" />
          </td>

          <td className="p-3 text-center">
            <div className="h-7 w-20 bg-gray-200 rounded-full mx-auto" />
          </td>

          <td className="p-3 text-center">
            <div className="flex justify-center gap-2">
              <div className="h-8 w-8 bg-gray-200 rounded-md" />
              <div className="h-8 w-8 bg-gray-200 rounded-md" />
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default CouponTableSkeleton;