const WalletSummary = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">Total Credit</p>
        <p className="text-xl font-semibold text-green-600">
          ${summary.totalCredit.toFixed(2)}
        </p>
      </div>

      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">Total Debit</p>
        <p className="text-xl font-semibold text-red-600">
          ${summary.totalDebit.toFixed(2)}
        </p>
      </div>

      <div className="bg-indigo-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600">Wallet Balance</p>
        <p className="text-xl font-semibold text-indigo-600">
          ${summary.balance.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default WalletSummary;