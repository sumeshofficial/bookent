const BannersNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
      <h2 className="text-lg font-medium mb-2">No banners found</h2>
      <p className="text-sm">
        Create a new banner to display promotions on the homepage.
      </p>
    </div>
  );
};

export default BannersNotFound;
