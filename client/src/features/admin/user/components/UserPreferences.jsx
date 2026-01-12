const UserPreferences = ({ preferences = {} }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Preferences</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Sport</p>
          <p className="font-medium">{preferences.sport || "-"}</p>
        </div>

        <div>
          <p className="text-gray-500">Venue</p>
          <p className="font-medium">{preferences.venue || "-"}</p>
        </div>

        <div>
          <p className="text-gray-500">Match Time</p>
          <p className="font-medium">{preferences.matchTime || "-"}</p>
        </div>

        <div>
          <p className="text-gray-500">Price Range</p>
          <p className="font-medium">{preferences.priceRange || "-"}</p>
        </div>
      </div>
    </div>
  );
};

export default UserPreferences;
