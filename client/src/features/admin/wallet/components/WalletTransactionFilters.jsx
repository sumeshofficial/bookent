import { useSearchParams } from "react-router-dom";

const WalletTransactionFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);

    if (!value) params.delete(key);
    else params.set(key, value);

    params.set("page", 1);
    setSearchParams(params, { replace: true });
  };

  const setQuickRange = (days) => {
    const params = new URLSearchParams(searchParams);

    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - days);

    params.set("fromDate", from.toISOString().split("T")[0]);
    params.set("toDate", to.toISOString().split("T")[0]);
    params.set("page", 1);

    setSearchParams(params, { replace: true });
  };

  const clearDates = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("fromDate");
    params.delete("toDate");
    params.set("page", 1);
    setSearchParams(params, { replace: true });
  };

  return (
    <div className="flex flex-wrap items-end gap-4 p-4 border-b bg-gray-50">
      <select
        value={searchParams.get("type") || ""}
        onChange={(e) => updateParam("type", e.target.value)}
        className="px-3 py-2 border rounded-lg text-sm"
      >
        <option value="">All Types</option>
        <option value="CREDIT">Credit</option>
        <option value="DEBIT">Debit</option>
      </select>

      <select
        value={searchParams.get("status") || ""}
        onChange={(e) => updateParam("status", e.target.value)}
        className="px-3 py-2 border rounded-lg text-sm"
      >
        <option value="">All Status</option>
        <option value="COMPLETED">Completed</option>
        <option value="PENDING">Pending</option>
        <option value="FAILED">Failed</option>
      </select>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-600">From</label>
        <input
          type="date"
          value={searchParams.get("fromDate") || ""}
          onChange={(e) => updateParam("fromDate", e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm text-black"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-600">To</label>
        <input
          type="date"
          value={searchParams.get("toDate") || ""}
          onChange={(e) => updateParam("toDate", e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm text-black"
        />
      </div>

      <button
        onClick={() => setQuickRange(0)}
        className="px-3 py-2 border rounded-lg text-sm bg-white"
      >
        Today
      </button>

      <button
        onClick={() => setQuickRange(7)}
        className="px-3 py-2 border rounded-lg text-sm bg-white"
      >
        Last 7 days
      </button>

      <button
        onClick={clearDates}
        className="px-3 py-2 border rounded-lg text-sm text-red-600 bg-white"
      >
        Clear Dates
      </button>
    </div>
  );
};

export default WalletTransactionFilters;
