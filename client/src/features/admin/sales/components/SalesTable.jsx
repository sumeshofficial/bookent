import PropTypes from "prop-types";

const SalesTable = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white shadow rounded p-6 text-center text-gray-500">
        No sales data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white shadow rounded">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Order ID</th>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-right">Gross Ticket</th>
            <th className="p-3 text-right">Discount</th>
            <th className="p-3 text-right">Platform Fee</th>
            <th className="p-3 text-right">Gateway Fee</th>
            <th className="p-3 text-left">Refund</th>
            <th className="p-3 text-right font-semibold">Net Revenue</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row._id} className="border-t">
              <td className="p-3">{row.orderId}</td>

              <td className="p-3">
                {new Date(row.createdAt).toLocaleDateString()}
              </td>

              <td className="p-3 text-right">
                ${row.grossTicketSales.toFixed(2)}
              </td>

              <td className="p-3 text-right text-red-600">
                -${row.discount.toFixed(2)}
              </td>

              <td className="p-3 text-right">
                ${row.platformGrossFee.toFixed(2)}
              </td>

              <td className="p-3 text-right text-orange-600">
                ${row.gatewayFee.toFixed(2)}
              </td>

              <td className="p-3">
                {row.refundStatus === "COMPLETED" ? (
                  <span className="text-red-600 font-medium">Refunded</span>
                ) : (
                  <span className="text-green-600">—</span>
                )}
              </td>

              <td className="p-3 text-right font-semibold text-green-600">
                ${row.platformNetRevenue.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

SalesTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      orderId: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      grossTicketSales: PropTypes.number.isRequired,
      discount: PropTypes.number.isRequired,
      platformGrossFee: PropTypes.number.isRequired,
      gatewayFee: PropTypes.number.isRequired,
      refundStatus: PropTypes.string,
      platformNetRevenue: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default SalesTable;
