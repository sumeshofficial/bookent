const UsersSkeleton = () => {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="space-y-2">
                <div className="h-3 w-28 bg-gray-200 rounded" />
                <div className="h-3 w-40 bg-gray-100 rounded" />
              </div>
            </div>
          </td>

          <td className="px-4 py-3">
            <div className="h-3 w-10 bg-gray-200 rounded" />
          </td>

          <td className="px-4 py-3">
            <div className="h-3 w-16 bg-gray-200 rounded" />
          </td>

          <td className="px-4 py-3">
            <div className="h-6 w-16 bg-gray-200 rounded-full" />
          </td>

          <td className="px-4 py-3">
            <div className="h-6 w-14 bg-gray-200 rounded-full" />
          </td>

          <td className="px-4 py-3">
            <div className="h-5 w-5 bg-gray-200 rounded" />
          </td>
        </tr>
      ))}
    </>
  );
};

export default UsersSkeleton;
