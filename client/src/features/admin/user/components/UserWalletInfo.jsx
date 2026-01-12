import { Wallet } from "lucide-react";

const UserWalletInfo = ({ wallet = 0 }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Wallet</h3>

      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          <Wallet className="w-5 h-5 text-gray-600" />
        </div>

        <div>
          <p className="text-xs text-gray-500">Current Balance</p>
          <p className="text-2xl font-semibold text-gray-900">
            ₹ {wallet.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserWalletInfo;
