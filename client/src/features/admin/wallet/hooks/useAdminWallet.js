import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import {
  getAdminWalletSummary,
  getAdminWalletTransactions,
} from "../services/adminWallet.service";

const QUERY_KEYS = {
  WALLET_SUMMARY: ["admin-wallet-summary"],
  WALLET_TRANSACTIONS: "admin-wallet-transactions",
};

export const useAdminWallet = () => {
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const limit = 10;

  const status = searchParams.get("status") || "";
  const reason = searchParams.get("reason") || "";
  const type = searchParams.get("type") || "";
  const fromDate = searchParams.get("fromDate") || "";
  const toDate = searchParams.get("toDate") || "";
  const sort = searchParams.get("sort") || "";

  const {
    data: summary,
    isLoading: summaryLoading,
    error: summaryError,
  } = useQuery({
    queryKey: QUERY_KEYS.WALLET_SUMMARY,
    queryFn: getAdminWalletSummary,
    staleTime: 60 * 1000,
  });

  const {
    data: txnResponse,
    isLoading: txnLoading,
    error: txnError,
  } = useQuery({
    queryKey: [
      QUERY_KEYS.WALLET_TRANSACTIONS,
      page,
      limit,
      status,
      reason,
      type,
      fromDate,
      toDate,
      sort,
    ],
    queryFn: () =>
      getAdminWalletTransactions({
        page,
        limit,
        status,
        reason,
        type,
        fromDate,
        toDate,
        sort,
      }),
    keepPreviousData: true,
  });

  return {
    summary,
    transactions: txnResponse?.data || [],
    pagination: txnResponse?.meta,
    summaryLoading,
    txnLoading,
    error: summaryError || txnError,
  };
};
