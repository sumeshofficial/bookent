import WalletSummary from "./components/WalletSummary";
import WalletFilters from "./components/WalletFilters";
import WalletTable from "./components/WalletTable";
import WalletTableSkeleton from "./components/WalletTableSkeleton";
import { useWallet } from "./hooks/useWallet";
import Navbar from "../../../sharedComponents/user/navbar/Navbar";
import WalletExportActions from "./components/WalletExportActions";

const Wallet = () => {
  const { summary, transactions, isLoading, meta } = useWallet();

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">My Wallet</h1>

        <WalletSummary summary={summary} />

        <WalletFilters />

        {transactions.length > 0 && <WalletExportActions />}

        {isLoading ? (
          <WalletTableSkeleton />
        ) : (
          <WalletTable transactions={transactions} meta={meta} />
        )}
      </div>
    </>
  );
};

export default Wallet;
