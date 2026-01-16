import PropTypes from "prop-types";
import Pagination from "../../../../sharedComponents/Pagination";
import { formatDate } from "../../../user/checkout/utils/dateTimeFormatter";
import { TRANSACTION_TYPE } from "../constants/wallet.constants";
import WalletTransactionFilters from "./WalletTransactionFilters";
import WalletTransactionSort from "./WalletTransactionSort";

const WalletTransactions = ({ transactions, pagination }) => {
  return (
    <div className="bg-white border rounded-xl p-3">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Recent Transactions</h2>
      </div>

      <WalletTransactionFilters />
      <WalletTransactionSort />

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left bg-gray-50">
            <tr>
              <th className="px-4 py-3">Transaction ID</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((txn) => (
              <tr key={txn._id} className="border-t">
                <td className="px-4 py-3 font-medium">{txn._id}</td>
                <td className="px-4 py-3">{txn.type}</td>
                <td className="px-4 py-3">{txn.reason}</td>
                <td
                  className={`px-4 py-3 font-medium ${
                    txn.transaction_direction === TRANSACTION_TYPE.CREDIT
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {`${txn.transaction_direction === TRANSACTION_TYPE.CREDIT ? "+" : "-"}$${txn.amount.value}`}
                </td>
                <td className="px-4 py-3">{formatDate(txn.createdAt)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full bg-gray-100 ${
                      txn.status === "COMPLETED" && "text-green-600"
                    }`}
                  >
                    {txn.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination meta={{ totalPages: pagination.totalPages }} />
      </div>
    </div>
  );
};

WalletTransactions.propTypes = {
  transactions: PropTypes.arrayOf(PropTypes.object).isRequired,
  pagination: PropTypes.shape({
    totalPages: PropTypes.number.isRequired,
  }).isRequired,
};

export default WalletTransactions;
