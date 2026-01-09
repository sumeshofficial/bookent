import { formatDate } from "../../../../utils/constants";

const RecentOrdersTable = ({ orders = [] }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <h3 className="font-semibold mb-4">Recent Orders</h3>

    <div className="hidden md:block overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-gray-500">
          <tr>
            <th className="py-2">Order ID</th>
            <th className="py-2">Date</th>
            <th className="py-2">Amount</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.orderId} className="border-t">
              <td className="py-2">{o.orderId}</td>
              <td className="py-2">{formatDate(o.createdAt)}</td>
              <td className="py-2">${o.amount}</td>
              <td className="py-2">{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    <div className="space-y-3 md:hidden">
      {orders.map((o) => (
        <div
          key={o.orderId}
          className="border rounded-lg p-3 text-sm space-y-1"
        >
          <div className="flex justify-between">
            <span className="text-gray-500">Order</span>
            <span className="font-medium">{o.orderId}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Date</span>
            <span>{formatDate(o.createdAt)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Amount</span>
            <span>${o.amount}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span>{o.status}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default RecentOrdersTable;