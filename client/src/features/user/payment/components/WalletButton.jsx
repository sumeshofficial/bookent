import { Wallet } from "lucide-react";
import { useModal } from "../../../../utils/constants";

const WalletButton = ({
  balance = 0,
  amount = 0,
  onPay,
  isLoading,
  isDisabled,
  error,
}) => {
  const isInsufficient = balance < amount;
  const { openModal, closeModal } = useModal();

  return (
    <div className="border rounded-xl p-5 bg-white max-w-md">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
          <Wallet className="w-5 h-5 text-gray-700" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">Pay using Wallet</p>
          <p className="text-xs text-gray-500">Available balance</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-600">Wallet Balance</span>
        <span className="text-lg font-semibold text-gray-900">
          ${balance.toLocaleString()}
        </span>
      </div>

      <div className="flex items-center justify-between mb-5">
        <span className="text-sm text-gray-600">Amount to pay</span>
        <span className="text-lg font-semibold text-gray-900">
          ${amount.toLocaleString()}
        </span>
      </div>

      {isInsufficient && (
        <p className="text-xs text-red-600 mb-3">Insufficient wallet balance</p>
      )}

      <button
        disabled={isInsufficient || isLoading}
        onClick={() =>
          openModal("wallet-payment", {
            amount,
            balance,
            isLoading,
            error,
            isDisabled,
            onConfirm: () => onPay(),
            onCancel: () => closeModal(),
          })
        }
        className={`w-full py-2.5 rounded-lg font-medium transition ${
          isInsufficient
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-black text-white hover:bg-gray-900"
        }`}
      >
        Pay with Wallet
      </button>
    </div>
  );
};

export default WalletButton;
