import PropTypes from 'prop-types';

const SearchFilter = ({ value, onChange }) => (
  <div>
    <label className="block text-xs text-gray-500 mb-1">Search</label>
    <input
      type="text"
      placeholder="Order ID"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);

SearchFilter.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SearchFilter;
