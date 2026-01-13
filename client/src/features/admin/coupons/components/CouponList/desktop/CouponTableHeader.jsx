const CouponTableHeader = () => {
  return (
    <thead className="hidden md:table-header-group bg-gray-100 text-sm text-gray-700">
      <tr>
        <th className="p-3 text-left font-medium">Code</th>
        <th className="p-3 text-left font-medium">Discount</th>
        <th className="p-3 text-center font-medium">Usage</th>
        <th className="p-3 text-center font-medium">Validity</th>
        <th className="p-3 text-center font-medium">Status</th>
        <th className="p-3 text-center font-medium">Actions</th>
      </tr>
    </thead>
  );
};

export default CouponTableHeader;
