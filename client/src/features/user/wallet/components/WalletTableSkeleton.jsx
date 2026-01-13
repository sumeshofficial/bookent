const WalletTableSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-8 bg-gray-200 rounded mb-3" />
      ))}
    </div>
  );
};

export default WalletTableSkeleton;
