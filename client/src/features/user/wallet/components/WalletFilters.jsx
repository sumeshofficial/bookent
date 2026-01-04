import { useSearchParams } from "react-router-dom";
import { WALLET_SORT } from "../constants/wallet.constants";

const WalletFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const sort = searchParams.get("sort") || WALLET_SORT.LATEST;
  const status = searchParams.get("status") || "";
  const type = searchParams.get("type") || "";
  const fromDate = searchParams.get("fromDate") || "";
  const toDate = searchParams.get("toDate") || "";

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    params.set("page", "1");
    setSearchParams(params);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4 grid grid-cols-1 md:grid-cols-6 gap-4">
      <select
        value={status}
        onChange={(e) => updateParam("status", e.target.value)}
        className="border rounded-md px-3 py-2 text-sm"
      >
        <option value="">All Status</option>
        <option value="COMPLETED">Completed</option>
        <option value="PENDING">Pending</option>
        <option value="FAILED">Failed</option>
      </select>

      <select
        value={type}
        onChange={(e) => updateParam("type", e.target.value)}
        className="border rounded-md px-3 py-2 text-sm"
      >
        <option value="">All Types</option>
        <option value="CREDIT">Credit</option>
        <option value="DEBIT">Debit</option>
      </select>

      <input
        type="date"
        value={fromDate}
        onChange={(e) => updateParam("fromDate", e.target.value)}
        className="border rounded-md px-3 py-2 text-sm"
      />

      <input
        type="date"
        value={toDate}
        onChange={(e) => updateParam("toDate", e.target.value)}
        className="border rounded-md px-3 py-2 text-sm"
      />

      <select
        value={sort}
        onChange={(e) => updateParam("sort", e.target.value)}
        className="border rounded-md px-3 py-2 text-sm"
      >
        <option value={WALLET_SORT.LATEST}>Latest</option>
        <option value={WALLET_SORT.OLDEST}>Oldest</option>
        <option value={WALLET_SORT.AMOUNT_HIGH}>Amount High → Low</option>
        <option value={WALLET_SORT.AMOUNT_LOW}>Amount Low → High</option>
      </select>

    </div>
  );
};

export default WalletFilters;