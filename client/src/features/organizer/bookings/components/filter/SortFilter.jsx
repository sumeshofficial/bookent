const SortFilter = ({ value, onChange }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1">
      Sort By
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <option value="LATEST">Latest</option>
      <option value="OLDEST">Oldest</option>
      <option value="AMOUNT_HIGH">Amount: High → Low</option>
      <option value="AMOUNT_LOW">Amount: Low → High</option>
    </select>
  </div>
);

export default SortFilter;