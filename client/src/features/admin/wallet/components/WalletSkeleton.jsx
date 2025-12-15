const WalletSkeleton = ({ type = "page" }) => {
  if (type === "stats") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 bg-gray-200 rounded-xl"
          />
        ))}
      </div>
    );
  }

  if (type === "transactions") {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-40 bg-gray-200 rounded" />

        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-12 bg-gray-200 rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-40 bg-gray-200 rounded" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 bg-gray-200 rounded-xl"
          />
        ))}
      </div>

      <div className="h-64 bg-gray-200 rounded-xl" />
    </div>
  );
};

export default WalletSkeleton;