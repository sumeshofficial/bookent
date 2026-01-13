import { useSearchParams } from "react-router-dom";

const WalletTransactionSort = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateSort = (value) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", value);
    params.set("page", 1);
    setSearchParams(params, { replace: true });
  };

  return (
    <div className="flex items-center gap-2 p-4">
      <span className="text-sm text-gray-600">Sort by:</span>

      <select
        value={searchParams.get("sort") || "latest"}
        onChange={(e) => updateSort(e.target.value)}
        className="px-3 py-2 border rounded-lg text-sm"
      >
        <option value="latest">Latest</option>
        <option value="oldest">Oldest</option>
        <option value="amount_desc">Amount ↓</option>
        <option value="amount_asc">Amount ↑</option>
      </select>
    </div>
  );
};

export default WalletTransactionSort;
