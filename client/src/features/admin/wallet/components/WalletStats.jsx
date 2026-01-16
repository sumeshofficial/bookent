import { ArrowDownLeft, ArrowUpRight, WalletIcon } from "lucide-react";
import PropTypes from "prop-types";

const WalletStats = ({ summary }) => {
  const stats = [
    {
      label: "Total Balance",
      value: `$${summary.balance.toFixed(2)}`,
      icon: <WalletIcon className="w-6 h-6 text-blue-600" />,
    },
    {
      label: "Total Credits",
      value: `$${summary.totalCredit.toFixed(2)}`,
      icon: <ArrowDownLeft className="w-6 h-6 text-green-600" />,
    },
    {
      label: "Total Debits",
      value: `$${summary.totalDebit.toFixed(2)}`,
      icon: <ArrowUpRight className="w-6 h-6 text-red-600" />,
    },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {stats.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-4 p-5 bg-white border rounded-xl"
        >
          <div className="p-3 bg-gray-100 rounded-lg">{item.icon}</div>
          <div>
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="text-xl font-semibold">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

WalletStats.propTypes = {
  summary: PropTypes.shape({
    balance: PropTypes.number.isRequired,
    totalCredit: PropTypes.number.isRequired,
    totalDebit: PropTypes.number.isRequired,
  }).isRequired,
};

export default WalletStats;
