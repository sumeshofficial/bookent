import Pagination from "../../../../sharedComponents/Pagination";
import { WALLET_DIRECTION } from "../constants/wallet.constants";

const WalletTable = ({ transactions, meta }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto pb-2">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left">
          <tr>
            <th className="p-3">Date</th>
            <th className="p-3">Transaction Id</th>
            <th className="p-3">Reason</th>
            <th className="p-3">Type</th>
            <th className="p-3">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td
                colSpan="4"
                className="p-6 text-center text-gray-500"
              >
                No wallet transactions found
              </td>
            </tr>
          ) : (
            transactions.map((tx) => (
              <tr key={tx._id} className="border-t">
                <td className="p-3">
                  {new Date(tx.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3">{tx._id}</td>
                <td className="p-3">{tx.type}</td>
                <td
                  className={`p-3 font-medium ${
                    tx.display_direction === WALLET_DIRECTION.CREDIT
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {tx.display_direction}
                </td>
                <td className="p-3">
                  ${tx.net_amount.value.toFixed(2)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Pagination meta={meta} />
    </div>
  );
};

export default WalletTable;