import PropTypes from "prop-types";
import { X, Wallet } from "lucide-react";
import { usePaymentMethods } from "../../hooks/usePaymentMethods";

const WalletPaymentConfirmation = ({ amount, balance, onCancel }) => {
  const insufficientBalance = balance < amount;

  const { isLoading, error, onClick } = usePaymentMethods();

  return (
    <div className="w-full relative">
      <button
        onClick={onCancel}
        disabled={isLoading}
        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
      >
        <X size={20} />
      </button>

      <div className="px-6 pt-6 text-center">
        <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-full bg-indigo-50 mb-4">
          <Wallet className="text-indigo-600" size={28} />
        </div>

        <h2 className="text-xl font-semibold text-gray-900">
          Confirm Wallet Payment
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Please review your wallet payment details
        </p>
      </div>

      <div className="px-6 py-5 space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Payable Amount</span>
          <span className="font-semibold text-gray-900">
            ₹{amount.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Wallet Balance</span>
          <span
            className={`font-semibold ${
              insufficientBalance ? "text-red-600" : "text-gray-900"
            }`}
          >
            ₹{balance.toLocaleString()}
          </span>
        </div>

        {insufficientBalance && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            Insufficient wallet balance. Please add money to continue.
          </div>
        )}

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}
      </div>

      <div className="px-6 pb-6 flex gap-3">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
        >
          Cancel
        </button>

        <button
          onClick={() => onClick()}
          disabled={isLoading || insufficientBalance}
          className="flex-1 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Processing..." : "Pay with Wallet"}
        </button>
      </div>
    </div>
  );
};

WalletPaymentConfirmation.propTypes = {
  amount: PropTypes.number.isRequired,
  balance: PropTypes.number.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default WalletPaymentConfirmation;
