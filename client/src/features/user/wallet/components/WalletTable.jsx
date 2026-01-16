import PropTypes from "prop-types";
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
              <td colSpan="5" className="p-6 text-center text-gray-500">
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
                <td className="p-3">${tx.net_amount.value.toFixed(2)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Pagination meta={meta} />
    </div>
  );
};

WalletTable.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      display_direction: PropTypes.oneOf([
        WALLET_DIRECTION.CREDIT,
        WALLET_DIRECTION.DEBIT,
      ]).isRequired,
      net_amount: PropTypes.shape({
        value: PropTypes.number.isRequired,
      }).isRequired,
    })
  ).isRequired,

  meta: PropTypes.shape({
    page: PropTypes.number,
    totalPages: PropTypes.number,
    limit: PropTypes.number,
  }).isRequired,
};

export default WalletTable;
