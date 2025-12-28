export const buildWalletTransactionSort = (sort = "latest") => {
  const sortMap = {
    LATEST: { createdAt: -1 },
    OLDEST: { createdAt: 1 },
    AMOUNT_HIGH: { "net_amount.value": -1 },
    AMOUNT_LOW: { "net_amount.value": 1 },
  };

  return sortMap[sort] || sortMap.latest;
};
