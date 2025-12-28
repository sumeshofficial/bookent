import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import {
  fetchWalletSummary,
  fetchWalletTransactions,
} from "../services/wallet.service";

export const useWallet = () => {
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);

  const sort = searchParams.get("sort") || "LATEST";
  const status = searchParams.get("status") || "";
  const type = searchParams.get("type") || "";
  const fromDate = searchParams.get("fromDate") || "";
  const toDate = searchParams.get("toDate") || "";

  const summaryQuery = useQuery({
    queryKey: ["wallet-summary"],
    queryFn: fetchWalletSummary,
  });

  const transactionsQuery = useQuery({
    queryKey: [
      "wallet-transactions",
      page,
      limit,
      sort,
      status,
      type,
      fromDate,
      toDate,
    ],
    queryFn: () =>
      fetchWalletTransactions({
        page,
        limit,
        sort,
        status,
        type,
        fromDate,
        toDate,
      }),
    keepPreviousData: true,
  });

  return {
    summary: summaryQuery.data,
    transactions: transactionsQuery.data?.data || [],
    meta: transactionsQuery.data?.meta,
    isLoading: transactionsQuery.isLoading,
  };
};