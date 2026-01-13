import WalletHeader from "./components/WalletHeader";
import WalletStats from "./components/WalletStats";
import WalletTransactions from "./components/WalletTransactions";
import WalletSkeleton from "./components/WalletSkeleton";
import { useAdminWallet } from "./hooks/useAdminWallet";

const AdminWallet = () => {
  const {
    summary,
    transactions,
    pagination,
    summaryLoading,
    txnLoading,
    error,
  } = useAdminWallet();

  if (error) return <p className="text-red-500">Failed to load wallet</p>;

  return (
    <div className="p-6 space-y-6">
      <WalletHeader />

      {summaryLoading ? (
        <WalletSkeleton type="stats" />
      ) : (
        <WalletStats summary={summary} />
      )}

      {txnLoading ? (
        <WalletSkeleton type="transactions" />
      ) : (
        <WalletTransactions
          transactions={transactions}
          pagination={pagination}
        />
      )}
    </div>
  );
};

export default AdminWallet;
