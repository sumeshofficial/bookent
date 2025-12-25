const SeatFilter = ({ seatCategories, value, onChange }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1">
      Seat Section
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <option value="">All Sections</option>
      {seatCategories?.map((seat, i) => (
        <option key={i} value={seat.name}>
          {seat.name}
        </option>
      ))}
    </select>
  </div>
);

export default SeatFilter;